function initApp() {
  let nantes = { lat: 47.217, lng: -1.553 };
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: nantes
  });

  fetchEtablissements(map);
  fetchingResidences(map);
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
            x.fields.implantation_lib
          ];
        });

        etablissements.map(x => {
          new google.maps.Marker({
            position: x[0],
            map: map
          });
        });

        let ul = document.getElementById("list-etablissements");

        etablissements.map(x => {
          let li = document.createElement("li");
          li.appendChild(document.createTextNode(x[1]));
          li.classList.add("list-group-item");
          ul.appendChild(li);
        });
      });
    } else {
      console.log(
        "Erreur, nous n'avons pas réussis à obtenir les établissements."
      );
    }
  });
}

function fetchingResidences(map) {
  fetch(
    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr_crous_logement_france_entiere&rows=100&facet=zone&refine.zone=NANTES"
  ).then(response => {
    if (response.ok) {
      response.json().then(json => {
        console.log(json);
      });
    } else {
      console.log(
        "Erreur, nous n'avons pas réussis à obtenir les résidences CROUS."
      );
    }
  });
}
