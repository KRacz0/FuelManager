#### Porównywarka cen paliw

Projekt musi spełniać następujące wymagania funkcjonalne:
* użytkownik może zarejestrować się w systemie
* użytkownik może przeglądać mapę i listę stacji paliwowych z filtrami na markę, rodzaj dostępnego paliwa, datę ostatniej aktualizacji cen oraz ceny
* użytkownik może zaproponować własne ceny poprzez specjalny formularz z polami liczbowymi oraz zdjęciem potwierdzającym dane
* administrator może zarządzać użytkownikami: widzi ich dane, może ich blokować
* administrator może zarządzać markami stacji
* administrator może zarządzać stacjami paliwowymi i ich cenami
  * każda stacja musi być przypisana do marki, mieć adres oraz koordynaty
* administrator może zarządzać propozycjami od użytkowników i nagradzać ich "punktami", jeżeli zaakceptuje ich dane
  * powinien też widzieć listę i statystyki dotyczące przyjętych i odrzuconych propozycji

Projekt musi spełniać następujące wymagania funkcjonalne:
* rejestracja powinna odbywać się klasycznie poprzez mejla oraz Facebooka
* backend i frontend powinny być odseparowane i komunikacja powinna iść poprzez REST API
* backend musi być udokumentowany w formie OpenAPI
