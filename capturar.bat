set anio=%date:~6,4%
set mes=%date:~3,2%
set dia=%date:~0,2%
set hora=%time:~0,2%
set hora=%hora: =0%
set minuto=%time:~3,2%
set segundo=%time:~6,2%

node ioniza.js papis%dia%%mes%%anio%_%hora%%minuto% COM3 3000 honeywell
