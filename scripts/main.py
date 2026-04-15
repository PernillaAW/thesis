import subprocess
import time


def main():
    resultList = []
   #for i in range(9):
    resultInsert = subprocess.run (["sudo", 
                              "perf", 
                              "stat", 
                              "-C", 
                              "1",
                              "-a",
                              "-e",
                              "power/energy-pkg/",
                              "curl",
                              "-s",
                              "-o",
                              "/dev/null",
                              "-X", 
                              "POST",
                              "-H", "Content-Type: application/json",
                              "-d", '{"file":"postgis/postgis.csv","collection":"unoptimized"}',
                              "http://localhost:3000/insert"],
                              capture_output=True,
                              text=True)
    resultList.append(resultInsert)
    print(1)
    #time.sleep(300)
    resultReadAll = subprocess.run (["sudo", 
                              "perf", 
                              "stat", 
                              "-C", 
                              "1",
                              "-a",
                              "-e",
                              "power/energy-pkg/",
                              "curl",
                              "-s",
                              "-o",
                              "/dev/null",
                              "-X", 
                              "POST",
                              "-H", "Content-Type: application/json",
                              "-d", '{"collection":"unoptimized"}',
                              "http://localhost:3000/read_all"],
                              capture_output=True,
                              text=True)
    resultList.append(resultReadAll)
    print(2)
    #time.sleep(300)
    resultReadPartial = subprocess.run (["sudo", 
                              "perf", 
                              "stat", 
                              "-C", 
                              "1",
                              "-a",
                              "-e",
                              "power/energy-pkg/",
                              "curl",
                              "-s",
                              "-o",
                              "/dev/null",
                              "-X", 
                              "POST",
                              "-H", "Content-Type: application/json",
                              "-d", '{"collection":"unoptimized", "columnOne": "Severity", "columnTwo": "State", "valueOne":"2", "valueTwo":"SC"}',
                              "http://localhost:3000/read_partial"],
                              capture_output=True,
                              text=True)
    resultList.append(resultReadPartial)
    print(3)
    #time.sleep(300)
    resultReadOne = subprocess.run (["sudo", 
                              "perf", 
                              "stat", 
                              "-C", 
                              "1",
                              "-a",
                              "-e",
                              "power/energy-pkg/",
                              "curl",
                              "-s",
                              "-o",
                              "/dev/null",
                              "-X", 
                              "POST",
                              "-H", "Content-Type: application/json",
                              "-d", '{"collection":"unoptimized"}',
                              "http://localhost:3000/read_one"],
                              capture_output=True,
                              text=True)
    resultList.append(resultReadOne)
    print(4)
    #time.sleep(300)
    resultDelete = subprocess.run (["sudo", 
                              "perf", 
                              "stat", 
                              "-C", 
                              "1",
                              "-a",
                              "-e",
                              "power/energy-pkg/",
                              "curl",
                              "-s",
                              "-o",
                              "/dev/null",
                              "-X", 
                              "POST",
                              "-H", "Content-Type: application/json",
                              "-d", '{"collection":"unoptimized"}',
                              "http://localhost:3000/delete"],
                              capture_output=True,
                              text=True)
    resultList.append(resultDelete)
    print(5)

    for i in resultList:
        print(i)

if __name__ == "__main__":
    main();
    


