from pyspark.sql import functions as F
from pyspark import SparkConf, StorageLevel
from pyspark.sql.functions import isnan, when, count, col
from pyspark.sql.types import FloatType
import pandas as pd
import numpy as np


from pyspark import SparkConf
from pyspark.sql import SparkSession

conf = SparkConf().setMaster('local[*]').setAppName("CarAccidents") \
.set("spark.driver.memory", "6g") \
.set("spark.executor.memory", "1g") \
.set("spark.driver.memoryOverhead", "256m") \
.set("spark.executor.memoryOverhead", "256m") \
.set("spark.sql.files.maxPartitionBytes", "64m") 

spark = SparkSession.builder.config(conf=conf).getOrCreate()
sc = spark.sparkContext

df = spark.read.options(header=True, escape='"', multiline=True,
                          ).parquet('hdfs://localhost:9000/converted_numbers/')


df_basic = df.select(["Severity", "State", "Description"])
""" df_orcal = df.select(["Severity", "Precipitation", "Description"])
df_postgre = df.select(["Severity", "Windy"])
df_postgis = df.select(["Start_Lat", "Start_Lng"])
df_mongo = df.select(["Severity", "Windy"])
df_couchbase = df.select(["Severity", "State"])
df_cassandra = df.select(["Severity", "Start_Time", "End_Time"])
 """
df_basic_50 = np.array_split(df_basic, 2)

pandas = df_basic_50[["Severity","State"]]
table = pd.crosstab(pandas["State"], pandas["Severity"])
print(table)



""" df_basic.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/basic/')

df_orcal.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/orcal/')

df_postgre.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/postgre/')

df_postgis.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/postgig/')

df_mongo.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/mongo/')

df_couchbase.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/couchbase/')

df_cassandra.repartition(7).write.mode('overwrite').parquet('hdfs://localhost:9000/cassandra/') """
""" 
pandas = df_basic.select("Severity","State").toPandas()
table = pd.crosstab(pandas["State"], pandas["Severity"])
print(table)

pandas = df_orcal.select("Severity","Precipitation").toPandas()
table = pd.crosstab(pandas["Precipitation"], pandas["Severity"])
print(table)

pandas = df_postgre.select("Severity","Windy").toPandas()
table = pd.crosstab(pandas["Windy"], pandas["Severity"])
print(table)

pandas = df_postgis.select("Start_Lat","Start_Lng").toPandas()
table = pd.crosstab(pandas["Start_Lat"], pandas["Start_Lng"])
print(table)

pandas = df_mongo.select("Severity","Windy").toPandas()
table = pd.crosstab(pandas["Windy"], pandas["Severity"])
print(table)

pandas = df_cassandra.select("Severity","Start_Time").toPandas()
table = pd.crosstab(pandas["Start_Time"], pandas["Severity"])
print(table) """