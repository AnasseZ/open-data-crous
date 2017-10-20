function initApp() {
  let nantes = { lat: 47.217, lng: -1.553 };
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: nantes
  });

  fetchEtablissements(map);
  //fetchingResidences(map);
}

function fetchingResidencesByCity(map, ville) {
  fetch(
    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr_crous_logement_france_entiere&rows=100&facet=zone&refine.zone=" +
      ville
  )
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          let residences = json.records.map(function(x) {
            return [
              {
                lat: x.geometry.coordinates[1],
                lng: x.geometry.coordinates[0]
              },
              x.fields.title
            ];
          });
          residences.map(x => {
            new google.maps.Marker({
              position: x[0],
              map: map
            });
          });
          console.log(residences);
          //  return residences;
        });
        //console.log(response);
      } else {
        console.log(
          "Erreur, nous n'avons pas réussis à obtenir les résidences CROUS."
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function fetchEtablissements(map) {
  fetch(
    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-implantations_etablissements_d_enseignement_superieur_publics&rows=100&sort=siege_lib&refine.localisation=Pays+de+la+Loire%3ENantes&refine.siege_lib=Université+de+Nantes"
  ).then(function(response) {
    if (response.ok) {
      response.json().then(function(json) {
        let etablissements = json.records.map(function(x) {
          return [
            {
              lat: x.geometry.coordinates[1],
              lng: x.geometry.coordinates[0]
            },
            x.fields.implantation_lib,
            x.fields.com_nom
          ];
        });
        //console.log(etablissements);

        let ul = document.getElementById("list-etablissements");

        etablissements.map(x => {
          let a = document.createElement("a");
          a.onclick = () => {
            //console.log(x[2]);
            let val = x[2]
              .toUpperCase()
              .replace("-", "+")
              .replace(" ", "+");
            console.log(val);
            fetchingResidencesByCity(map, val);
          };
          let li = document.createElement("li");
          li.appendChild(document.createTextNode(x[1]));
          li.classList.add("list-group-item");
          a.appendChild(li);
          ul.appendChild(a);
        });
      });
    } else {
      console.log(
        "Erreur, nous n'avons pas réussis à obtenir les établissements."
      );
    }
  });
}
