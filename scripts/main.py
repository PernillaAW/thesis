import subprocess
import time
import requests
import csv
import re
"""
BASIC:
"-d", '{"collection":"unoptimized", "columnOne": "Severity", "columnTwo": "State", "valueOne":"2", "valueTwo":"SC"}',

FOR OPTIMIZED CASSANDRA:
Workload A 
"-d", '{"collection":"optimizedbytime", "columnOne": "Date", "valueOne":17:53:00, "valueTwo": 18:30:00}',
Workload B and C:
"-d", '{"collection":"optimizedbytime", "columnOne": "Date", "valueOne":17:52:00, "valueTwo": 18:29:00}',

FOR OPTIMIZED GIS:
Workload A
"-d", '{"collection":"optimized", "valueOne":24.54, "valueTwo":-81.9, "valueThree":27.7, "valueFour":-78.7}',
Workload B
"-d", '{"collection":"optimized", "valueOne":28.34, "valueTwo":-99.68, "valueThree":32.3, "valueFour":-95.72}',
Workload C
"-d", '{"collection":"optimized", "valueOne":33.8, "valueTwo":-118.46, "valueThree":34.32, "valueFour":-117.94}',


FOR OPTIMIZED ORACLE:
Workload A, B, C:
"-d", '{"collection":"optimized", "columnOne": "Windy", "columnTwo": "Precipitation", "valueOne":0, "valueTwo":1.638706}',

FOR OPTIMIZED MONGODB & POSTGREE:
Workload A, B, C:
"-d", '{"collection":"optimized", "columnOne": "Windy", "columnTwo": "Severity", "valueOne":0, "valueTwo":4}',

        

"""

def main():
    results = []
    count = 0;
    for i in range(10):  
        print("RUN ", count)
        insert = subprocess.run(
                                ["sudo", 
                                "perf", 
                                "stat",
                                "-C", "0-3",
                                "-e", "power_core/energy-core/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimized", "path": "dataB"}',
                                "http://localhost:3000/insert"],
                                capture_output=True,
                                text=True)
        print("Insert done")
        print(insert.stderr)

        energy, times = retreive_values(insert.stderr)
        results.append({"Run": count,
                        "Operation": "insert",
                        "Energy": energy,
                        "Time": times})
        subprocess.run([   "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimized"}',
                                "http://localhost:3000/postgisdrop"],
                                capture_output=True,
                                text=True)
        time.sleep(60)
        read_all = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", "0-3",
                                "-e", "power_core/energy-core/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimized"}',
                                "http://localhost:3000/read_all"],
                                capture_output=True,
                                text=True)

        print("Read all done")   
        print(read_all.stderr)
        energy, times = retreive_values(read_all.stderr)
        results.append({"Run": count,
                        "Operation": "read_all",
                        "Energy": energy,
                        "Time": times})   
        time.sleep(60)
        
        partial = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", 
                                "0-3",
                                "-e", "power_core/energy-core/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimized", "valueOne":33.8, "valueTwo":-118.46, "valueThree":34.32, "valueFour":-117.94}',
                                "http://localhost:3000/read_partial"],
                                capture_output=True,
                                text=True)
        print("Partial done")
        print(partial.stderr)
        energy, times = retreive_values(partial.stderr)
        results.append({"Run": count, "Operation": "partial", "Energy": energy, "Time": times})   
        time.sleep(60)
        read_one = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", 
                                "0-3",
                                "-e", "power_core/energy-core/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimized"}',
                                "http://localhost:3000/read_one"],
                                capture_output=True,
                                text=True)
    
        print("read_one done")
        print(read_one.stderr)
        energy, times = retreive_values(read_one.stderr)
        results.append({"Run": count,
                        "Operation": "read_one",
                        "Energy": energy,
                        "Time": times})   
        time.sleep(60)
        
        delete = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", 
                                "0-3",
                                "-e", "power_core/energy-core/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimized"}',
                                "http://localhost:3000/delete"],
                                capture_output=True,
                                text=True)
        print("Delete done")
        print(delete.stderr)
        energy, times = retreive_values(delete.stderr)
        results.append({"Run": count,
                        "Operation": "delete",
                        "Energy": energy,
                        "Time": times}) 
        
        count += 1
    summary = calc_min_max_average(results)
    write_csv_wide(results, summary)
        
        

def retreive_values(perf_reading):
    lines = [line.strip() for line in perf_reading.split('\n') if line.strip()]
    energy = None
    executeTime = None

    for line in lines:
        
        if "Joules" in line:
            match = re.search(r'([\d\u202f,\.]+)\s+Joules', line)
            if match:
                value = match.group(1)
                value = value.replace('\u202f', '').replace(',', '.')
                energy = float(value)

        if "seconds time elapsed" in line or "seconds" in line:
            parts = line.split()
            for p in parts:
                try:
                    executeTime = float(p.replace(',', '.'))
                    break
                except:
                    continue

    return energy, executeTime


def calc_min_max_average(result):
    stat_vals = {}

    for r in(result):
        operation = r["Operation"]
        stat_vals.setdefault(operation, []).append(r["Energy"])

    summery = []

    for operation, vals in stat_vals.items():
        summery.append({
            "Operation": operation,
            "Min": min(vals),
            "Max": max(vals),
            "Avg": sum(vals) / len(vals)
        })
    return summery

def pivot_results(result):
    pivot = {}
    runs = set()

    for r in result:
        op = r["Operation"]
        run = r["Run"]

        runs.add(run)

        pivot.setdefault(op, {})[run] = {
            "Energy": r["Energy"],
            "Time": r["Time"]
        }

    runs = sorted(runs)

    return pivot, runs



def write_csv_wide(result, summery):
    pivot, runs = pivot_results(result)

    with open("OPTIMISED_V2_POSTGIS_WB.csv", "w", newline="") as f:

        fieldnames = (
            ["Operation"] +
            [f"Run {r} Joules" for r in runs] +
            [f"Run {r} Time" for r in runs]
        )

        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        operation_order = ["insert", "read_all", "partial", "read_one", "delete"]

        for op in operation_order:
            if op in pivot:
                row = {"Operation": op}

                for r in runs:
                    row[f"Run {r} Joules"] = pivot[op].get(r, {}).get("Energy", "")

                for r in runs:
                    row[f"Run {r} Time"] = pivot[op].get(r, {}).get("Time", "")

                writer.writerow(row)

        writer.writerow({})
        writer.writerow({})

        summary_fields = ["Operation", "Min", "Max", "Avg"]
        writer = csv.DictWriter(f, fieldnames=summary_fields)

        writer.writeheader()

        for s in summery:
            writer.writerow(s)


if __name__ == "__main__":
    main();
    
