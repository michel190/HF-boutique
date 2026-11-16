/* =====================================================================
   HF BOUTIQUE — CONTENU DU SITE
   C'est le seul fichier à modifier pour mettre le site à jour.
   Les textes après // sont des explications : le site ne les lit pas.
   Gardez bien les guillemets et les virgules.
   ===================================================================== */


/* 1. LA BOUTIQUE ------------------------------------------------------ */

const BOUTIQUE = {
  nom: "HF Boutique",
  whatsapp: "22871654515",              // indicatif + numéro, sans « + » ni espaces
  whatsappAffiche: "+228 71 65 45 15",  // le numéro tel qu'il s'affiche sur le site
  ville: "Lomé, Togo",
  adresse: "",                          // ex. "Quartier …, à côté de …" (laisser "" tant que ce n'est pas prêt)
  lienCarte: "",                        // lien Google Maps de la boutique, commençant par https:// (facultatif)

  // Horaires : ["ouverture", "fermeture"] sur 24 h, ou null si la boutique est fermée ce jour-là.
  horaires: {
    lundi:    ["08:00", "19:00"],
    mardi:    ["08:00", "19:00"],
    mercredi: ["08:00", "19:00"],
    jeudi:    ["08:00", "19:00"],
    vendredi: ["08:00", "19:00"],
    samedi:   ["08:00", "19:00"],
    dimanche: null,
  },
  // Les horaires ci-dessus sont un EXEMPLE. Tant que cette ligne vaut true, le site affiche
  // « Horaires indicatifs ». Une fois les vrais horaires saisis, mettez false :
  // le site affichera alors « Ouvert » ou « Fermé » en direct.
  horairesAConfirmer: true,

  // Photos réelles (à placer dans le dossier images/). Laisser "" tant que la photo n'est pas prête.
  photos: {
    accueil: "",                        // grande photo du haut de page, ex. "images/accueil.jpg"
    boutique: [
      { fichier: "", legende: "Façade de la boutique" },
      { fichier: "", legende: "Rayons homme et femme" },
      { fichier: "", legende: "Tenue portée sur mannequin" },
    ],
  },
};


/* 2. LES COULEURS ------------------------------------------------------
   Nom affiché : teinte. Ajoutez une ligne pour créer un nouveau coloris. */

const COULEURS = {
  "Blanc": "#FAF9F6",
  "Écru": "#EDE6D8",
  "Beige": "#D9C7AB",
  "Camel": "#B98B5E",
  "Marron": "#6B4A35",
  "Kaki": "#6F7B5C",
  "Vert sapin": "#2F4A3C",
  "Bleu ciel": "#A9C3DA",
  "Bleu jean": "#4F6D8F",
  "Bleu marine": "#22304A",
  "Gris": "#9A9A96",
  "Noir": "#1E1E1E",
  "Bordeaux": "#6E2433",
  "Terracotta": "#B4623F",
  "Rose poudré": "#E3BDB5",
  "Doré": "#C9A45C",
  "Argent": "#C4C6CB",
};


/* 3. LES TAILLES ------------------------------------------------------- */

const T_VETEMENTS = ["S", "M", "L", "XL", "XXL"];
const T_CHAUSSURES_HOMME = ["39", "40", "41", "42", "43", "44", "45"];
const T_CHAUSSURES_FEMME = ["36", "37", "38", "39", "40", "41"];
const T_CHAUSSURES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];


/* 4. LE CATALOGUE ------------------------------------------------------
   Un article = un bloc entre accolades { … }, suivi d'une virgule.
   Pour ajouter un article : copiez un bloc, collez-le, changez les valeurs.
   Pour en retirer un : supprimez son bloc.

   id           identifiant unique : minuscules, chiffres et tirets seulement
   nom          nom affiché sur le site
   rayon        "homme", "femme", "chaussures" ou "accessoires"
   genre        pour les chaussures et accessoires : "homme", "femme" ou "mixte"
   type         famille : "chemises", "tshirts", "pantalons", "robes", "ensembles",
                "vestes", "hauts", "jupes", "chaussures" ou "accessoires"
   visuel       dessin affiché tant qu'il n'y a pas de photo : chemise, tshirt, polo, veste,
                pantalon, robe, jupe, haut, ensemble-h, ensemble-f, soulier, mocassin,
                basket, sandale, sac, ceinture, montre, lunettes, bijou, parfum
   photo        photo réelle, ex. "images/chemise-blanche.jpg". Elle remplace le dessin.
                Conseil : photo verticale, 1000 px de large, moins de 200 Ko.
   description  une phrase de présentation
   couleurs     coloris proposés (noms de la liste COULEURS)
   tailles      T_VETEMENTS, T_CHAUSSURES_HOMME, T_CHAUSSURES_FEMME, T_CHAUSSURES
                ou une liste comme ["38", "40", "42"]
   occasions    "bureau", "soiree", "quotidien" (pour « Idées de tenues »)
   nouveau      true pour l'afficher dans « Nouveautés & promos »
   promo        true pour afficher l'étiquette « Promo »
   prix         facultatif, en F CFA, ex. 12000. Sans prix : « Prix sur demande ».
   ancienPrix   facultatif : prix barré d'une promotion

   Les articles ci-dessous sont des EXEMPLES construits sur les rayons de la boutique.
   Remplacez-les par vos vrais articles et vos photos. */

const PRODUITS = [

  /* ----- Mode Homme ----- */
  { id: "chemise-habillee", nom: "Chemise habillée", rayon: "homme", type: "chemises", visuel: "chemise", photo: "",
    description: "La chemise des réunions, des cérémonies et des grandes occasions.",
    couleurs: ["Blanc", "Bleu ciel", "Noir"], tailles: T_VETEMENTS, occasions: ["bureau", "soiree"] },

  { id: "chemise-decontractee", nom: "Chemise décontractée", rayon: "homme", type: "chemises", visuel: "chemise", photo: "",
    description: "À porter tous les jours, boutonnée ou ouverte sur un t-shirt.",
    couleurs: ["Kaki", "Beige", "Bleu jean"], tailles: T_VETEMENTS, occasions: ["quotidien"], nouveau: true },

  { id: "t-shirt", nom: "T-shirt", rayon: "homme", type: "tshirts", visuel: "tshirt", photo: "",
    description: "La base de toutes les tenues décontractées.",
    couleurs: ["Blanc", "Noir", "Kaki"], tailles: T_VETEMENTS, occasions: ["quotidien"], promo: true },

  { id: "polo", nom: "Polo", rayon: "homme", type: "tshirts", visuel: "polo", photo: "",
    description: "Plus habillé qu'un t-shirt, plus léger qu'une chemise.",
    couleurs: ["Bleu marine", "Blanc", "Bordeaux"], tailles: T_VETEMENTS, occasions: ["quotidien", "bureau"], nouveau: true },

  { id: "jean", nom: "Jean", rayon: "homme", type: "pantalons", visuel: "pantalon", photo: "",
    description: "Le jean de tous les jours, à associer avec un polo ou une chemise.",
    couleurs: ["Bleu jean", "Noir"], tailles: T_VETEMENTS, occasions: ["quotidien"] },

  { id: "chino", nom: "Chino", rayon: "homme", type: "pantalons", visuel: "pantalon", photo: "",
    description: "Aussi à l'aise au bureau que le week-end.",
    couleurs: ["Beige", "Kaki", "Bleu marine"], tailles: T_VETEMENTS, occasions: ["quotidien", "bureau"], nouveau: true },

  { id: "pantalon-tailleur", nom: "Pantalon tailleur", rayon: "homme", type: "pantalons", visuel: "pantalon", photo: "",
    description: "Le pantalon habillé, pour le bureau et les cérémonies.",
    couleurs: ["Noir", "Gris", "Bleu marine"], tailles: T_VETEMENTS, occasions: ["bureau", "soiree"] },

  { id: "ensemble-homme", nom: "Ensemble", rayon: "homme", type: "ensembles", visuel: "ensemble-h", photo: "",
    description: "Haut et bas assortis : une tenue complète, prête à porter.",
    couleurs: ["Bleu marine", "Beige"], tailles: T_VETEMENTS, occasions: ["soiree", "bureau"] },

  { id: "veste", nom: "Veste", rayon: "homme", type: "vestes", visuel: "veste", photo: "",
    description: "La veste qui habille une chemise comme un t-shirt.",
    couleurs: ["Bleu marine", "Noir", "Camel"], tailles: T_VETEMENTS, occasions: ["bureau", "soiree"], nouveau: true },

  /* ----- Mode Femme ----- */
  { id: "robe-de-soiree", nom: "Robe de soirée", rayon: "femme", type: "robes", visuel: "robe", photo: "",
    description: "Pour les dîners, les fêtes et les cérémonies.",
    couleurs: ["Bordeaux", "Noir", "Vert sapin"], tailles: T_VETEMENTS, occasions: ["soiree"] },

  { id: "robe-decontractee", nom: "Robe décontractée", rayon: "femme", type: "robes", visuel: "robe", photo: "",
    description: "Légère et facile à porter, pour tous les jours.",
    couleurs: ["Terracotta", "Écru", "Bleu ciel"], tailles: T_VETEMENTS, occasions: ["quotidien"], nouveau: true },

  { id: "robe-professionnelle", nom: "Robe professionnelle", rayon: "femme", type: "robes", visuel: "robe", photo: "",
    description: "Sobre et élégante, pensée pour le bureau.",
    couleurs: ["Bleu marine", "Noir", "Gris"], tailles: T_VETEMENTS, occasions: ["bureau"] },

  { id: "haut", nom: "Haut", rayon: "femme", type: "hauts", visuel: "haut", photo: "",
    description: "Un haut simple, à assortir avec une jupe ou un pantalon.",
    couleurs: ["Blanc", "Rose poudré", "Noir"], tailles: T_VETEMENTS, occasions: ["quotidien"] },

  { id: "blouse", nom: "Blouse", rayon: "femme", type: "chemises", visuel: "chemise", photo: "",
    description: "Fluide et élégante, du bureau à la sortie du soir.",
    couleurs: ["Écru", "Bleu ciel", "Rose poudré"], tailles: T_VETEMENTS, occasions: ["bureau", "quotidien"], nouveau: true },

  { id: "jupe", nom: "Jupe", rayon: "femme", type: "jupes", visuel: "jupe", photo: "",
    description: "À porter avec un haut ou une blouse, au bureau comme en ville.",
    couleurs: ["Beige", "Noir", "Bordeaux"], tailles: T_VETEMENTS, occasions: ["bureau", "quotidien"], nouveau: true },

  { id: "pantalon-femme", nom: "Pantalon", rayon: "femme", type: "pantalons", visuel: "pantalon", photo: "",
    description: "Confortable et bien coupé, pour toutes les occasions.",
    couleurs: ["Noir", "Écru", "Kaki"], tailles: T_VETEMENTS, occasions: ["bureau", "quotidien"] },

  { id: "ensemble-coordonne", nom: "Ensemble coordonné", rayon: "femme", type: "ensembles", visuel: "ensemble-f", photo: "",
    description: "Haut et bas assortis : une tenue complète, sans réfléchir.",
    couleurs: ["Rose poudré", "Vert sapin"], tailles: T_VETEMENTS, occasions: ["soiree", "quotidien"], promo: true },

  /* ----- Chaussures ----- */
  { id: "souliers-habilles", nom: "Souliers habillés", rayon: "chaussures", genre: "homme", type: "chaussures", visuel: "soulier", photo: "",
    description: "Les souliers des tenues de bureau et de cérémonie.",
    couleurs: ["Noir", "Marron"], tailles: T_CHAUSSURES_HOMME, occasions: ["bureau", "soiree"] },

  { id: "baskets", nom: "Baskets tendance", rayon: "chaussures", genre: "mixte", type: "chaussures", visuel: "basket", photo: "",
    description: "La paire confortable qui va avec tout.",
    couleurs: ["Blanc", "Noir"], tailles: T_CHAUSSURES, occasions: ["quotidien"], nouveau: true },

  { id: "sandales", nom: "Sandales", rayon: "chaussures", genre: "femme", type: "chaussures", visuel: "sandale", photo: "",
    description: "Légères et élégantes, pour la ville comme pour les sorties.",
    couleurs: ["Camel", "Noir", "Doré"], tailles: T_CHAUSSURES_FEMME, occasions: ["quotidien", "soiree"] },

  { id: "mocassins", nom: "Mocassins", rayon: "chaussures", genre: "mixte", type: "chaussures", visuel: "mocassin", photo: "",
    description: "Faciles à enfiler, élégants sans effort.",
    couleurs: ["Marron", "Noir", "Bleu marine"], tailles: T_CHAUSSURES, occasions: ["bureau", "quotidien"], nouveau: true },

  /* ----- Accessoires ----- */
  { id: "sac-a-main", nom: "Sac à main", rayon: "accessoires", genre: "femme", type: "accessoires", visuel: "sac", photo: "",
    description: "Le sac qui complète la tenue, pour tous les jours ou pour sortir.",
    couleurs: ["Camel", "Noir", "Bordeaux"], occasions: ["bureau", "soiree", "quotidien"], nouveau: true },

  { id: "ceinture", nom: "Ceinture", rayon: "accessoires", genre: "mixte", type: "accessoires", visuel: "ceinture", photo: "",
    description: "Le détail qui finit une tenue.",
    couleurs: ["Noir", "Marron"], occasions: ["bureau"], promo: true },

  { id: "montre", nom: "Montre", rayon: "accessoires", genre: "mixte", type: "accessoires", visuel: "montre", photo: "",
    description: "Un classique au poignet, pour lui comme pour elle.",
    couleurs: ["Marron", "Noir"], occasions: ["bureau", "soiree"], nouveau: true },

  { id: "lunettes-de-soleil", nom: "Lunettes de soleil", rayon: "accessoires", genre: "mixte", type: "accessoires", visuel: "lunettes", photo: "",
    description: "Indispensables sous le soleil de Lomé.",
    couleurs: ["Noir", "Marron"], occasions: ["quotidien"], nouveau: true },

  { id: "bijoux-fantaisie", nom: "Bijoux fantaisie", rayon: "accessoires", genre: "femme", type: "accessoires", visuel: "bijou", photo: "",
    description: "La touche finale d'une tenue de soirée.",
    couleurs: ["Doré", "Argent"], occasions: ["soiree"] },

  { id: "parfum", nom: "Parfum", rayon: "accessoires", genre: "mixte", type: "accessoires", visuel: "parfum", photo: "", teinte: "#E6CB96",
    description: "Pour lui et pour elle. Demandez-nous les parfums disponibles.",
    occasions: ["soiree"] },

];
