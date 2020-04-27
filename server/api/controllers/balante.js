/*
SELECT 
'ante' as ctrl,
m.denumire,
`tranzactii`.`stare_material`,
`tranzactii`.`id_reper`,
    sum(`tranzactii`.`cantitate_debit`) as ti,
    sum(`tranzactii`.`cantitate_credit`) as te,

    sum(`tranzactii`.`debit`) as vi,
    sum(`tranzactii`.`credit`) as ve,
    sum(`tranzactii`.`cantitate_debit`)-sum(`tranzactii`.`cantitate_credit`) as stoc,
    sum(`tranzactii`.`debit`)-sum(`tranzactii`.`credit`) as valoarestoc,
    (sum(`tranzactii`.`debit`)-sum(`tranzactii`.`credit`))/(sum(`tranzactii`.`cantitate_debit`)-sum(`tranzactii`.`cantitate_credit`)) as pretmediu

FROM `bifa`.`tranzactii` 
inner join materiale m on m.id=id_reper
inner join operatiuni  op on op.id=`tranzactii`.`idAntet`
where op.data<='2020-04-06' and id_categ=9 and `tranzactii`.`stare`='ACTIV' and id_gestiune=1 and id_locdispunere=1
group by id_reper,`tranzactii`.`stare_material`
union all
SELECT 
'post' as ctrl,
m.denumire,
`tranzactii`.`stare_material`,
`tranzactii`.`id_reper`,
    sum(`tranzactii`.`cantitate_debit`) as ti,
    sum(`tranzactii`.`cantitate_credit`) as te,

    sum(`tranzactii`.`debit`) as vi,
    sum(`tranzactii`.`credit`) as ve,
    sum(`tranzactii`.`cantitate_debit`)-sum(`tranzactii`.`cantitate_credit`) as stoc,
    sum(`tranzactii`.`debit`)-sum(`tranzactii`.`credit`) as valoarestoc,
    (sum(`tranzactii`.`debit`)-sum(`tranzactii`.`credit`))/(sum(`tranzactii`.`cantitate_debit`)-sum(`tranzactii`.`cantitate_credit`)) as pretmediu

FROM `bifa`.`tranzactii` 
inner join materiale m on m.id=id_reper
inner join operatiuni  op on op.id=`tranzactii`.`idAntet`
where op.data>='2020-04-07' and op.data<='2020-04-13' and id_categ=9 and `tranzactii`.`stare`='ACTIV' and id_gestiune=1 and id_locdispunere=1
group by id_reper,`tranzactii`.`stare_material`

*/