let markers = [];

function initApp() {
  let nantes = { lat: 47.217, lng: -1.553 };
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: nantes
  });

  fetchEtablissements(map);
}

function fetchingResidencesByCity(map, etablissement, ville) {
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
              residence.fields.title,
              residence.fields.contact,
              residence.fields.services
            ];
          });

          addMarkers(etablissement, residences, map);
          recenterMap(map, etablissement[0]);
          distanceCalculation(etablissement, residences);
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

function addMarkers(etablissement, residences, map) {
  clearMarkers(markers);

  markers = residences.map(residence => {
    let infowindow = new google.maps.InfoWindow({
      content:
        '<div id="blackDiv"><b>' +
        residence[2] +
        "</b><br> Services : " +
        residence[3] +
        "</div>"
    });

    let marker = new google.maps.Marker({
      position: residence[0],
      map: map
    });

    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });

    return marker;
  });

  let icon = "blue_MarkerE.png";

  let etablissementMarker = new google.maps.Marker({
    position: etablissement[0],
    map: map,
    title: etablissement[1],
    icon: icon
  });

  markers.push(etablissementMarker);
}

function clearMarkers(markers) {
  markers.map(marker => {
    marker.setMap(null);
  });

  markers = [];
}

function recenterMap(map, position) {
  map.setCenter(position);
}

function distanceCalculation(etablissement, residences) {
  let destinations = residences.map(residence => {
    return residence[0];
  });

  let service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [etablissement[0]],
      destinations: destinations,
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    },
    (response, status) => {
      if (status !== "OK") {
        alert("Error was: " + status);
      } else {
        let results = response.rows[0].elements.map((calcultedDistance, i) => {
          return [
            calcultedDistance.distance.text,
            calcultedDistance.duration.text,
            residences[i]
          ];
        });
        showResult(results);
      }
    }
  );
}

function showResult(results) {
  let resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  results.sort().map(result => {
    let p = document.createElement("p");
    p.innerHTML =
      result[2][1] +
      " est à " +
      result[1] +
      " et se situe à " +
      result[0] +
      " .";
    resultDiv.appendChild(p);
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

        handleInput(etablissements, map);
        //listCreation(etablissements, map);
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
      fetchingResidencesByCity(
        map,
        etablissement,
        transformCityName(etablissement[2])
      );
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

function handleInput(etablissements, map) {
  let input = document.getElementById("myinput");

  let list = etablissements.map(etablissement => {
    return etablissement[1];
  });

  new Awesomplete(input, {
    list: list
  });

  let button = document.getElementById("residencesButton");
  button.addEventListener("click", () => {
    let etablissementChoisis;
    for (var i = 0; i < etablissements.length; i++) {
      if (input.value === etablissements[i][1]) {
        etablissementChoisis = etablissements[i];
      }
    }

    fetchingResidencesByCity(
      map,
      etablissementChoisis,
      transformCityName(etablissementChoisis[2])
    );
  });
}
