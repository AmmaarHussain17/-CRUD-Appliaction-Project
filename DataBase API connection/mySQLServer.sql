use afrahdb;

LOAD DATA INFILE  'C:\ProgramData\MySQL\MySQL Server 8.0\Uploads\bulk_data.csv' INTO TABLE characters
FIELDS TERMINATED BY ','
IGNORE 1 LINES;

SELECT @@secure_file_priv;