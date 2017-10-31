function initApp() {
  let nantes = { lat: 47.217, lng: -1.553 };
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: nantes
  });

  fetchEtablissements(map);
}

function fetchingResidencesByCity(map, ville) {
  fetch(
    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr_crous_logement_france_entiere&rows=100&facet=zone&refine.zone=" +
      ville
  )
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          let residences = json.records.map(function(residence) {
            return [
              {
                lat: residence.geometry.coordinates[1],
                lng: residence.geometry.coordinates[0]
              },
              residence.fields.title
            ];
          });

          addMarkers(residences, map);
        });
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

function addMarkers(residences, map) {
  residences.map(residence => {
    new google.maps.Marker({
      position: residence[0],
      map: map
    });
  });
}

function fetchEtablissements(map) {
  fetch(
    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-implantations_etablissements_d_enseignement_superieur_publics&rows=100&sort=siege_lib&refine.localisation=Pays+de+la+Loire%3ENantes&refine.siege_lib=Université+de+Nantes"
  ).then(function(response) {
    if (response.ok) {
      response.json().then(function(json) {
        let etablissements = json.records.map(function(etablissement) {
          return [
            {
              lat: etablissement.geometry.coordinates[1],
              lng: etablissement.geometry.coordinates[0]
            },
            etablissement.fields.implantation_lib,
            etablissement.fields.com_nom
          ];
        });

        listCreation(etablissements, map);
      });
    } else {
      console.log(
        "Erreur, nous n'avons pas réussis à obtenir les établissements."
      );
    }
  });
}

function listCreation(etablissements, map) {
  let ul = document.getElementById("list-etablissements");

  etablissements.map(etablissement => {
    let a = document.createElement("a");
    a.onclick = () => {
      fetchingResidencesByCity(map, transformCityName(etablissement[2]));
    };

    let li = document.createElement("li");
    li.appendChild(document.createTextNode(etablissement[1]));
    li.classList.add("list-group-item");

    a.appendChild(li);
    ul.appendChild(a);
  });
}

function transformCityName(city) {
  if (city === "La Roche-sur-Yon") {
    return "LA+ROCHE+SUR+YON";
  } else if (city === "Coulaines") {
    return "LE+MANS";
  }

  return city.toUpperCase().replace(" ", "+");
}
