import subprocess
import time
import requests
import csv
"""
BASIC:
"-d", '{"collection":"optimizedbytime", "columnOne": "Severity", "columnTwo": "State", "valueOne":"2", "valueTwo":"SC"}'

FOR OPTIMIZED CASSANDRA:
"-d", '{"collection":"optimized", "columnOne": "Date", "valueOne":"2016", "valueTwo":"20:30:00", "valueThree":"21:45:00"}',


"""

def main():
    resultList = [];
    fieldnames = [
    "id",
    "IDLE Joules", "IDLE Time",
    "Insert joules", "Insert time",
    "Read All joules", "Read All time",
    "Read Partial joules", "Read Partial time",
    "Read One joules", "Read One Time",
    "Delete Joules", "Delete Time"]
    count = 0;
    for i in range(10):
        sleeptime = subprocess.run(["sudo", 
                                "perf", 
                                "stat",
                                "-C", "0-3",
                                "-e",
                                "power/energy-pkg/",
                                "taskset", "-c", "0-3",
                                "sleep", "5"],
                                capture_output=True,
                                text=True)
        resultList.append(sleeptime.stderr)

        resultInsert = subprocess.run(
                                ["sudo", 
                                "perf", 
                                "stat",
                                "-C", "0-3",
                                "-e",
                                "power/energy-pkg/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimizedbytime"}',
                                "http://localhost:3000/insert"],
                                capture_output=True,
                                text=True)

        resultList.append(resultInsert.stderr)

        print(1)
        
        #time.sleep(100)
        resultReadAll = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", "0-3",
                                "-e",
                                "power/energy-pkg/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimizedbytime"}',
                                "http://localhost:3000/read_all"],
                                capture_output=True,
                                text=True)
        resultList.append(resultReadAll.stderr)
        print(2)
        
        #time.sleep(100)
        resultReadPartial = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", 
                                "0-3",
                                "-e",
                                "power/energy-pkg/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"table":"optimizedbytime", "startTime": "20:30:00", "endTime":"21:45:00"}',
                                "http://localhost:3000/read_partial"],
                                capture_output=True,
                                text=True)
        resultList.append(resultReadPartial.stderr)
        print(3)
        #time.sleep(100)
        
        resultReadOne = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", 
                                "0-3",
                                "-e",
                                "power/energy-pkg/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimizedbytime"}',
                                "http://localhost:3000/read_one"],
                                capture_output=True,
                                text=True)
        resultList.append(resultReadOne.stderr)
        
        print(4)
        #time.sleep(100)
        
        resultDelete = subprocess.run (["sudo", 
                                "perf", 
                                "stat", 
                                "-C", 
                                "0-3",
                                "-e",
                                "power/energy-pkg/",
                                "curl",
                                "-s",
                                "-o",
                                "/dev/null",
                                "-X", 
                                "POST",
                                "-H", "Content-Type: application/json",
                                "-d", '{"collection":"optimizedbytime"}',
                                "http://localhost:3000/delete"],
                                capture_output=True,
                                text=True)
        resultList.append(resultDelete.stderr)
        
        print(5)   

        count += 1
        row = {"id": count}
        labels = [
            ("IDLE Joules", "IDLE Time"),
            ("Insert joules", "Insert time"),
            ("Read All joules", "Read All time"),
            ("Read Partial joules", "Read Partial time"),
            ("Read One joules", "Read One Time"),
            ("Delete Joules", "Delete Time")
        ]

        for idx, result in enumerate(resultList):
            lines = [line.strip() for line in result.split('\n') if line.strip()]
            energy = None
            executeTime = None

            for line in lines:
                if "Joules" in line:
                    value = line.split()[0]
                    value = value.replace('\u202f', '').replace(',','.')
                    energy = float(value)
                elif "seconds" in line:
                    value = line.split()[0]
                    value = value.replace(',','.')
                    executeTime = float(value)

            row[labels[idx][0]] = energy
            row[labels[idx][1]] = executeTime
        with open("cassandrafull.csv", "a", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=row.keys())
            if f.tell() == 0:
                writer.writeheader()
            writer.writerow(row)
        resultList = []


        #time.sleep(100)
    with open("cassandrafull.csv", "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        avg_row = {
            "id": "AVG",
            "IDLE Joules": "=AVERAGE(B2:B11)",
            "IDLE Time": "=AVERAGE(C2:C11)",
            "Insert joules": "=AVERAGE(D2:D11)",
            "Insert time": "=AVERAGE(E2:E11)",
            "Read All joules": "=AVERAGE(F2:F11)",
            "Read All time": "=AVERAGE(G2:G11)",
            "Read Partial joules": "=AVERAGE(H2:H11)",
            "Read Partial time": "=AVERAGE(I2:I11)",
            "Read One joules": "=AVERAGE(J2:J11)",
            "Read One Time": "=AVERAGE(K2:K11)",
            "Delete Joules": "=AVERAGE(L2:L11)",
            "Delete Time": "=AVERAGE(M2:M11)"
        }

        writer.writerow(avg_row)

if __name__ == "__main__":
    main();
    
