#  Open Data Crous

Application web développée par le Groupe **Zougarh Anasse - Boubacar Mentache**  dans le cadre du module de Données sur le web.

## Rôle de l'application

Permet aux étudiants de l'Université de Nantes de trouver les résidences CROUS les plus proches de leurs établissements afin d'optimiser leurs recherche pour un nouveau logement.

## Quelles données sont utilisées?

Nous utilisons l'[api]( https://data.enseignementsup-recherche.gouv.fr/pages/home/ ) proposé par le Ministère de l'enseignement supérieur, de la recherche et de l'innovation du gouvernement Français.
Cette api propose plus de 70 jeux de données, nous en utilisons 2 d'entre eux afin de les manipuler.

## Licence des données

Les données utilisées sont des données ouvertes sous licence ouverte [ETALAB](https://www.etalab.gouv.fr/wp-content/uploads/2014/05/Licence_Ouverte.pdf).
Nous pouvons donc reproduire, publier, exploiter ces données etc...
  
## Jeux de données
  
- Le premier jeu de donnée a pour identifiant :
_**fr-esr-implantations_etablissements_d_enseignement_superieur_publics**_

Il fournit des données sur l'implantations des établissements d'enseignement supérieur publics, nous filtrons ce premier jeu de donnée pour obtenir uniquement ceux liés à l'Université de Nantes.

- Le second jeu de donnée a pour identifiant :
_**fr_crous_logement_france_entiere**_

Il fournit l'ensemble des logements proposés aux étudiants par le réseau des CROUS.
Ces données sont issues du jeu de données open data mis à disposition par le **Centre National des Œuvres Universitaires et Scolaires** (CNOUS) https://www.data.gouv.fr/fr/datasets/logements-etudiants/ 

  
## Mode d'emploi

 L'utilisateur entre le nom de son établissement et se voit proposer une liste trié des résidences CROUS les plus proches de son établissement d'origine. 
 Les résidences sont marquées sur une Google map via des marqueurs cliquables fournissant des informations supplémentaires sur la résidence comme son adresse ou bien les services proposés comme le Wi-fi, parking privée etc...
 
## Technologies utilisées
 
 Nous utilisons donc l'API proposé par le gouvernement pour obtenir les données qu'on utilise ensuite via l'API Google maps afin de les exploiter et transmettre l'information.

Toute la logique est faite côté client en Javascript.


