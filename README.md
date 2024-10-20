#### System zarządzania pizzerią

* administrator pizzerii może zarządzać danymi pizzerii (nazwa, adres itp.)
* administrator pizzerii może zarządzać pracownikami
* pracownik pizzerii może zarządzać stanem magazynowym
  * np. może wpisać, że na stanie posiada 10kg sera mozzarella
* pracownik pizzerii może układać menu złożone z różnych pizz składających się z uprzednio zdefiniowanych składników
  * np. "pizza inferno" może składać się z sosu pomidorowego, sera mozzarelli, sera gorgonzoli, salami picante, nduji i cebuli
* pracownik otrzymuje powiadomienia, gdy stan danego produktu zbliża się do zera
* klient przychodzący do pizzerii może na stronie internetowej obejrzeć dostępne menu i zamówić dowolną liczbę pizz
  * widzi tylko te, które są aktualnie możliwe do zrobienia przez kucharza ze względu na stany magazynowe
  * każde zamówienie zmniejsza stan magazynowy produktów potrzebnych do wyprodukowania pizzy
  * może zamówić pizzę z własnymi składnikami, ale także modyfikować zaproponowane przez pizzerię pozycje (np. "pizza inferno, ale bez cebuli")
* administrator widzi dzienne, tygodniowe i miesięczne zużycie danych produktów oraz liczbę zamówień konkretnych pozycji z menu
* administrator widzi logi z aplikacji

Projekt musi spełniać następujące wymagania funkcjonalne:
* system powinien mieć części przeznaczone dla klienta i dla zalogowanych pracownika i administratora
* powiadomienia o brakach magazynowych powinny być wysyłane zbiorczo raz dziennie
* wszystkie akcje powinny być logowane w systemie i widoczne dla administratora; każda akcja musi mieć informację "kto", "co" i "kiedy", np.:
  * klient zamówił pozycję z menu `5092f1b7-d392-479d-8709-a8b1b30d37c6` w dniu `2024-10-14 16:23:03`
  * pracownik `13079bb3-ff52-48a6-b3f3-b440be13e9ee` usunął pozycję z menu `5092f1b7-d392-479d-8709-a8b1b30d37c6` w dniu `2024-10-14 17:14:32`

* rejestracja powinna odbywać się klasycznie poprzez mejla oraz Facebooka
* identyfikator podsystemu musi wyświetlać się w URL-u: w subdomenie (np. https://rewak.cms.localhost/) lub routingu (np. https://cms.localhost/rewak/)
* zaproszenia użytkowników powinny odbywać się poprzez link zaproszeniem, który:
  * aktywowany przez zalogowanego użytkownika, wyświetli formularz potwierdzający akceptację zaproszenia
  * aktywowany przez gościa, wyświetli formularze rejestracji i logowania, ale po pierwszym zalogowaniu wyświetli formularz potwierdzający akceptację zaproszenia
