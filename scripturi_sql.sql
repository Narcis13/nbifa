--
-- Modifica data din cimpul nou data_ang din angajmente cu vaorea corespunzatoare din anteeangajamente
--

UPDATE angajamente
INNER JOIN anteteangajamente ON angajamente.idAntet = anteteangajamente.id
SET angajamente.data_ang = anteteangajamente.dataang