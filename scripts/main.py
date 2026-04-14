import subprocess


def main():
    resultList = []
    for i in range(9):
        result = subprocess.run (["sudo", 
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
                                  "-X", "POST",
                                  "-H", "Content-Type: application/json",
                                  "-d", '{"file":"test","collection":123}', 
                                  "http://localhost:3000/insert"],
                                  capture_output=True,
                                  text=True)
        print(result.stderr)
        resultList.append(result)

    

