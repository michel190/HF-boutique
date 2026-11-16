/* HF Boutique — fonctionnement du site.
   Le contenu (boutique, horaires, articles) se modifie dans donnees.js. */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const sansAccent = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const pluriel = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");
  const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const RAYONS = { homme: "Mode Homme", femme: "Mode Femme", chaussures: "Chaussures", accessoires: "Accessoires" };
  const RAYONS_DESC = {
    tout: "Les arrivages changent souvent. Prix et disponibilité confirmés sur WhatsApp.",
    homme: "Chemises habillées ou décontractées, t-shirts, polos, pantalons (jeans, chinos, tailleurs), ensembles et vestes.",
    femme: "Robes de soirée, décontractées ou professionnelles, hauts, blouses, jupes, pantalons et ensembles coordonnés.",
    chaussures: "Souliers habillés, baskets tendance, sandales et mocassins, pour homme et femme.",
    accessoires: "Sacs à main, ceintures, montres, lunettes de soleil, bijoux fantaisie et parfums.",
  };
  const GENRES = { homme: "Homme", femme: "Femme", mixte: "Homme et Femme" };
  const TYPES = { tshirts: "T-shirts et polos", chemises: "Chemises et blouses", pantalons: "Pantalons", robes: "Robes", ensembles: "Ensembles", vestes: "Vestes", hauts: "Hauts", jupes: "Jupes", chaussures: "Chaussures", accessoires: "Accessoires" };
  const OCCASIONS = { bureau: "Élégant au bureau", soiree: "Prêt pour la soirée", quotidien: "Décontracté au quotidien" };
  const ICONE_WA = '<svg class="ic ic-plein" aria-hidden="true"><use href="#i-wa"></use></svg>';

  /* ---------- Données ---------- */
  const produits = (typeof PRODUITS !== "undefined" ? PRODUITS : []).map((p) => Object.assign({}, p, {
    genre: p.rayon === "homme" || p.rayon === "femme" ? p.rayon : p.genre || "mixte",
    couleurs: p.couleurs || [],
    tailles: p.tailles || [],
    occasions: p.occasions || [],
    photos: [].concat(p.photos || p.photo || []).filter(Boolean),
  }));
  const parId = new Map(produits.map((p) => [p.id, p]));
  const teinte = (nom) => (typeof COULEURS !== "undefined" && COULEURS[nom]) || nom || "#B8B3A8";

  /* ---------- WhatsApp ---------- */
  const wa = (texte) => "https://wa.me/" + BOUTIQUE.whatsapp + "?text=" + encodeURIComponent(texte);
  const bonjour = "Bonjour " + BOUTIQUE.nom + ", ";
  const MESSAGES = {
    general: bonjour + "je vous écris depuis votre site.",
    nouveautes: bonjour + "quelles sont vos nouveautés et promotions du moment ?",
    localisation: bonjour + "pouvez-vous m'envoyer la localisation de la boutique ?",
    photos: bonjour + "pouvez-vous m'envoyer des photos réelles de vos articles ?",
  };
  const ligneArticle = (p, couleur, taille) => "- " + p.nom + " (" + RAYONS[p.rayon] + ")" + (couleur ? ", coloris " + couleur.toLowerCase() : "") + (taille ? ", taille " + taille : "");
  const msgArticle = (p, couleur, taille) => bonjour + "je souhaite commander cet article vu sur votre site :\n\n" + ligneArticle(p, couleur, taille) + "\n\nEst-il disponible ? Merci de me confirmer le prix.";
  const msgListe = (intro, liste) => bonjour + intro + "\n\n" + liste.map((p) => ligneArticle(p)).join("\n") + "\n\nPouvez-vous me confirmer la disponibilité et les prix ?";

  /* ---------- Visuels : photo réelle si elle existe, sinon dessin ---------- */
  const dessin = (v, couleur) => '<svg viewBox="0 0 120 120" style="color:' + esc(couleur) + '" aria-hidden="true" focusable="false"><use href="#v-' + esc(v) + '"></use></svg>';
  function visuel(p, couleur) {
    const c = teinte(couleur || p.couleurs[0] || p.teinte);
    if (p.photos.length) return '<img src="' + esc(p.photos[0]) + '" alt="' + esc(p.nom) + '" loading="lazy" decoding="async" data-secours="' + esc(p.visuel) + '" data-teinte="' + esc(c) + '">';
    return dessin(p.visuel, c);
  }
  // Une photo introuvable laisse la place au dessin plutôt qu'à une image cassée.
  document.addEventListener("error", (e) => {
    const im = e.target;
    if (!im || im.tagName !== "IMG") return;
    if (im.dataset.secours) im.insertAdjacentHTML("afterend", dessin(im.dataset.secours, im.dataset.teinte));
    const hero = im.closest("#hero-visuel");
    if (hero) hero.classList.remove("avec-photo");
    const figure = im.closest(".photo");
    if (figure) figure.innerHTML = photoVide(im.alt);
    im.remove();
  }, true);

  const nombre = new Intl.NumberFormat("fr-FR");
  const fcfa = (n) => nombre.format(n) + " F CFA";
  const prix = (p) => p.prix ? (p.ancienPrix ? "<s>" + fcfa(p.ancienPrix) + "</s>" : "") + "<strong>" + fcfa(p.prix) + "</strong>" : "Prix sur demande";

  /* ---------- Sélection (les articles marqués d'un cœur) ---------- */
  let selection = new Set();
  try { selection = new Set(JSON.parse(localStorage.getItem("hf-selection") || "[]").filter((id) => parId.has(id))); } catch (e) { /* stockage indisponible : la sélection reste en mémoire */ }
  const sauver = () => { try { localStorage.setItem("hf-selection", JSON.stringify([...selection])); } catch (e) { /* idem */ } };

  function basculer(id) {
    if (selection.has(id)) selection.delete(id); else selection.add(id);
    sauver();
    majSelection();
    return selection.has(id);
  }

  function majSelection() {
    $$("[data-compteur]").forEach((el) => { el.textContent = selection.size; el.hidden = !selection.size; });
    $$("[data-coeur]").forEach((b) => {
      const p = parId.get(b.dataset.coeur), on = selection.has(b.dataset.coeur);
      b.setAttribute("aria-pressed", on);
      const texte = $("[data-coeur-texte]", b);
      if (texte) texte.textContent = on ? "Dans ma sélection" : "Ajouter à ma sélection";
      else if (p) b.setAttribute("aria-label", on ? "Retirer " + p.nom + " de ma sélection" : "Ajouter " + p.nom + " à ma sélection");
    });
    const articles = [...selection].map((id) => parId.get(id)).filter(Boolean);
    $("#selection-vide").hidden = articles.length > 0;
    $("#selection-pied").hidden = articles.length === 0;
    $("#selection-liste").innerHTML = articles.map((p) =>
      '<li class="ligne"><span class="ligne-visuel">' + visuel(p) + '</span><span class="ligne-texte"><strong>' + esc(p.nom) + "</strong><span>" + esc(RAYONS[p.rayon]) + '</span></span>' +
      '<button class="ic-btn" type="button" data-retirer="' + esc(p.id) + '" aria-label="Retirer ' + esc(p.nom) + ' de ma sélection"><svg class="ic" aria-hidden="true"><use href="#i-fermer"></use></svg></button></li>').join("");
    $("#selection-wa").href = wa(msgListe("voici ma sélection sur votre site :", articles));
  }

  /* ---------- Carte article ---------- */
  function carte(p) {
    const badge = p.promo ? '<span class="badge badge-promo">Promo</span>' : p.nouveau ? '<span class="badge">Nouveau</span>' : "";
    const pastilles = p.couleurs.slice(0, 5).map((c) => '<i class="pastille" style="background:' + esc(teinte(c)) + '" title="' + esc(c) + '"></i>').join("");
    return '<article class="carte">' +
      '<div class="carte-haut"><div class="carte-visuel">' + visuel(p) + "</div>" + badge +
        '<button class="coeur" type="button" data-coeur="' + esc(p.id) + '" aria-pressed="false"><svg class="ic" aria-hidden="true"><use href="#i-coeur"></use></svg></button>' +
        '<a class="wa-rapide" href="' + esc(wa(msgArticle(p))) + '" target="_blank" rel="noopener" aria-label="Commander ' + esc(p.nom) + ' sur WhatsApp">' + ICONE_WA + "</a>" +
      "</div>" +
      '<div class="carte-infos"><h3 class="carte-nom"><a href="#p-' + esc(p.id) + '" data-fiche="' + esc(p.id) + '">' + esc(p.nom) + "</a></h3>" +
        '<p class="carte-prix">' + prix(p) + "</p>" +
        '<div class="pastilles"' + (p.couleurs.length ? ' role="img" aria-label="Coloris : ' + esc(p.couleurs.join(", ")) + '"' : "") + ">" + pastilles + "</div>" +
      "</div></article>";
  }

  /* ---------- Catalogue : rayons, familles, occasions, recherche ---------- */
  const filtre = { genre: "rayon", valeur: "tout", q: "" };
  const champ = $("#q");

  function filtrer() {
    if (filtre.q) {
      const mots = sansAccent(filtre.q).split(/\s+/).filter(Boolean);
      return produits.filter((p) => {
        const texte = sansAccent([p.nom, p.description, RAYONS[p.rayon], TYPES[p.type], GENRES[p.genre], p.couleurs.join(" ")].join(" "));
        return mots.every((m) => texte.includes(m));
      });
    }
    if (filtre.genre === "type") return produits.filter((p) => p.type === filtre.valeur);
    if (filtre.genre === "occasion") return produits.filter((p) => p.occasions.includes(filtre.valeur));
    return filtre.valeur === "tout" ? produits : produits.filter((p) => p.rayon === filtre.valeur);
  }

  function rendreCatalogue() {
    const liste = filtrer();
    const libelle = filtre.q ? "« " + filtre.q + " »" : filtre.genre === "type" ? TYPES[filtre.valeur] : filtre.genre === "occasion" ? OCCASIONS[filtre.valeur] : "";
    $("#grille").innerHTML = liste.length ? liste.map(carte).join("") :
      '<div class="vide"><p><strong>Aucun article trouvé' + (filtre.q ? " pour « " + esc(filtre.q) + " »" : "") + ".</strong></p><p>Décrivez-nous ce que vous cherchez, nous regardons en boutique.</p>" +
      '<a class="btn btn-noir" target="_blank" rel="noopener" href="' + esc(wa(bonjour + "je cherche : " + (filtre.q || "un article") + ". L'avez-vous en boutique ?")) + '">' + ICONE_WA + "Demander sur WhatsApp</a></div>";
    $("#catalogue-etat").textContent = pluriel(liste.length, "article");
    $("#filtre-actif").hidden = !libelle;
    $("#filtre-actif-texte").textContent = libelle;
    $("#rayon-desc").textContent = (!libelle && RAYONS_DESC[filtre.valeur]) || RAYONS_DESC.tout;
    $$("#filtres [aria-pressed]").forEach((b) => b.setAttribute("aria-pressed", !libelle && b.dataset.rayon === filtre.valeur));
    $$("[data-type]").forEach((b) => b.setAttribute("aria-pressed", !filtre.q && filtre.genre === "type" && b.dataset.type === filtre.valeur));
    majSelection();
  }

  const allerAuCatalogue = () => $("#catalogue").scrollIntoView({ behavior: mouvementReduit ? "auto" : "smooth", block: "start" });

  function appliquer(genre, valeur) {
    if (genre !== "rayon" && !filtre.q && filtre.genre === genre && filtre.valeur === valeur) { genre = "rayon"; valeur = "tout"; }
    filtre.genre = genre; filtre.valeur = valeur; filtre.q = ""; champ.value = "";
    rendreCatalogue();
    allerAuCatalogue();
  }

  $("#recherche").addEventListener("submit", (e) => {
    e.preventDefault();
    filtre.q = champ.value.trim();
    if (filtre.q) { filtre.genre = "rayon"; filtre.valeur = "tout"; }
    rendreCatalogue();
    allerAuCatalogue();
    champ.blur();
  });
  champ.addEventListener("input", () => { filtre.q = champ.value.trim(); rendreCatalogue(); });

  /* ---------- Nouveautés & promos ---------- */
  let onglet = "homme";
  function rendreNouveautes() {
    const liste = produits.filter((p) => (p.nouveau || p.promo) && p.genre === onglet);
    $("#rangee-nouv").innerHTML = liste.length ? liste.map(carte).join("") :
      '<div class="vide"><p>Pas de nouveauté dans cette catégorie pour le moment.</p><a class="btn btn-noir" target="_blank" rel="noopener" href="' + esc(wa(MESSAGES.nouveautes)) + '">' + ICONE_WA + "Demander les arrivages</a></div>";
    $$("[data-tab]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tab === onglet));
    majSelection();
  }

  /* ---------- Composez votre tenue ---------- */
  const EMPLACEMENTS = [
    { role: "Haut", types: ["chemises", "tshirts", "hauts"] },
    { role: "Bas", types: ["pantalons", "jupes"] },
    { role: "Chaussures", rayon: "chaussures" },
    { role: "Accessoire", rayon: "accessoires" },
  ];
  const PREFERES = { homme: ["chemise-decontractee", "chino", "mocassins", "montre"], femme: ["blouse", "jupe", "sandales", "sac-a-main"] };
  const optionsTenue = (k, genre) => {
    const e = EMPLACEMENTS[k];
    return produits.filter((p) => (e.rayon ? p.rayon === e.rayon : e.types.includes(p.type)) && (p.genre === genre || (e.rayon && p.genre === "mixte")));
  };
  const depart = (genre) => EMPLACEMENTS.map((e, k) => Math.max(0, optionsTenue(k, genre).findIndex((p) => p.id === PREFERES[genre][k])));
  const tenue = { genre: "homme", i: depart("homme") };

  function rendreTenue() {
    const pieces = EMPLACEMENTS.map((e, k) => {
      const o = optionsTenue(k, tenue.genre);
      return o.length ? { k, role: e.role, o, p: o[tenue.i[k] % o.length] } : null;
    }).filter(Boolean);
    $("#tenue-pieces").innerHTML = pieces.map((x) =>
      '<button class="piece" type="button" data-piece="' + x.k + '"' + (x.o.length < 2 ? " disabled" : "") + ' aria-label="' + esc(x.role + " : " + x.p.nom + (x.o.length > 1 ? ". Essayer une autre pièce" : "")) + '">' +
        '<span class="piece-visuel">' + visuel(x.p) + "</span>" +
        '<span class="piece-role">' + esc(x.role) + "</span>" +
        '<span class="piece-nom">' + esc(x.p.nom) + "</span>" +
        (x.o.length > 1 ? '<span class="piece-changer" aria-hidden="true"><svg class="ic"><use href="#i-changer"></use></svg></span>' : "") +
      "</button>").join("") +
      '<div class="tenue-total"><div class="grappe" aria-hidden="true">' + pieces.map((x) => visuel(x.p)).join("") + "</div>" +
      '<div class="tenue-total-texte"><strong>Votre tenue</strong><span>' + pluriel(pieces.length, "pièce") + " · prix sur WhatsApp</span></div></div>";
    $("#tenue-wa").href = wa(msgListe("je souhaite commander cette tenue vue sur votre site :", pieces.map((x) => x.p)));
    $$("[data-genre]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.genre === tenue.genre));
  }

  /* ---------- Fiche article ---------- */
  const dlgFiche = $("#fiche");
  let fiche = null, choix = { couleur: null, taille: null }, pousse = false;

  function afficherFiche(p) {
    fiche = p;
    choix = { couleur: null, taille: null };
    const badge = p.promo ? '<span class="badge badge-promo">Promo</span>' : p.nouveau ? '<span class="badge">Nouveau</span>' : "";
    const pour = p.rayon === "chaussures" || p.rayon === "accessoires" ? " · " + GENRES[p.genre] : "";
    const garantie = (t) => '<li><svg class="ic" aria-hidden="true"><use href="#i-ok"></use></svg><span>' + t + "</span></li>";
    $("#fiche-contenu").innerHTML =
      '<div class="fiche-visuel" id="fiche-visuel">' + visuel(p) + badge + "</div>" +
      '<div class="fiche-infos">' +
        '<p class="surtitre">' + esc(RAYONS[p.rayon] + pour) + "</p>" +
        '<h2 id="fiche-titre">' + esc(p.nom) + "</h2>" +
        '<p class="fiche-prix">' + prix(p) + (p.prix ? "" : " · confirmé sur WhatsApp") + "</p>" +
        (p.description ? '<p class="fiche-desc">' + esc(p.description) + "</p>" : "") +
        (p.couleurs.length ? '<div class="option"><h3>Coloris souhaité <span id="fiche-coloris">(facultatif)</span></h3><div class="choix choix-couleurs">' +
          p.couleurs.map((c) => '<button type="button" data-couleur="' + esc(c) + '" aria-pressed="false" aria-label="' + esc(c) + '" title="' + esc(c) + '"><i style="background:' + esc(teinte(c)) + '"></i></button>').join("") + "</div></div>" : "") +
        (p.tailles.length ? '<div class="option"><h3>Taille souhaitée <span>(facultatif)</span></h3><div class="choix">' +
          p.tailles.map((t) => '<button type="button" data-taille="' + esc(t) + '" aria-pressed="false">' + esc(t) + "</button>").join("") + "</div></div>" : "") +
        '<div class="fiche-actions">' +
          '<a class="btn btn-noir btn-bloc" id="fiche-wa" href="#" target="_blank" rel="noopener">' + ICONE_WA + "Commander sur WhatsApp</a>" +
          '<button class="btn btn-blanc btn-bloc" type="button" data-coeur="' + esc(p.id) + '" aria-pressed="false"><svg class="ic" aria-hidden="true"><use href="#i-coeur"></use></svg><span data-coeur-texte>Ajouter à ma sélection</span></button>' +
        "</div>" +
        '<ul class="garanties">' + garantie("Livraison à domicile à Lomé") + garantie('Paiement à la livraison, par Flooz ou par <span class="nw">T-Money</span>') + garantie("Photos réelles de l'article sur demande") + "</ul>" +
      "</div>";
    majFiche();
    majSelection();
    if (!dlgFiche.open) dlgFiche.showModal();
    $("#fiche-contenu").scrollTop = 0;
  }

  function majFiche() {
    if (!fiche) return;
    $$("[data-couleur]", dlgFiche).forEach((b) => b.setAttribute("aria-pressed", b.dataset.couleur === choix.couleur));
    $$("[data-taille]", dlgFiche).forEach((b) => b.setAttribute("aria-pressed", b.dataset.taille === choix.taille));
    const libelle = $("#fiche-coloris");
    if (libelle) libelle.textContent = choix.couleur ? ": " + choix.couleur.toLowerCase() : "(facultatif)";
    const svg = $("#fiche-visuel svg");
    if (svg) svg.style.color = teinte(choix.couleur || fiche.couleurs[0] || fiche.teinte);
    $("#fiche-wa").href = wa(msgArticle(fiche, choix.couleur, choix.taille));
  }

  // L'adresse de la page suit la fiche ouverte : le bouton Retour du téléphone la referme,
  // et le lien d'un article peut être partagé (…/#p-chemise-habillee).
  function ouvrirFiche(id) {
    if (!parId.has(id)) return;
    const h = "#p-" + id;
    if (location.hash !== h) { pousse = true; location.hash = h; } else routeur();
  }
  function routeur() {
    const m = /^#p-([a-z0-9-]+)$/.exec(location.hash);
    const p = m && parId.get(m[1]);
    if (p) afficherFiche(p);
    else { pousse = false; if (dlgFiche.open) dlgFiche.close(); }
  }
  window.addEventListener("hashchange", routeur);
  dlgFiche.addEventListener("close", () => {
    if (!/^#p-/.test(location.hash)) return;
    if (pousse) { pousse = false; history.back(); return; }
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { location.hash = ""; }
  });

  /* ---------- Horaires (Lomé est à l'heure UTC toute l'année) ---------- */
  const CLES = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const ABREGES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const minutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const heure = (t) => { const [h, m] = t.split(":").map(Number); return h + "h" + (m ? String(m).padStart(2, "0") : ""); };
  const plage = (h) => heure(h[0]) + " – " + heure(h[1]);

  function resumeHoraires() {
    const groupes = [];
    CLES.forEach((cle, i) => {
      const h = BOUTIQUE.horaires[cle], signature = h ? h.join() : "", dernier = groupes[groupes.length - 1];
      if (dernier && dernier.signature === signature) dernier.fin = i; else groupes.push({ signature, h, debut: i, fin: i });
    });
    return groupes.filter((g) => g.h).map((g) => (g.debut === g.fin ? ABREGES[g.debut] : ABREGES[g.debut] + " – " + ABREGES[g.fin]) + " · " + plage(g.h)).join(", ") || "Sur rendez-vous";
  }

  function statutActuel(date) {
    const j = (date.getUTCDay() + 6) % 7, maintenant = date.getUTCHours() * 60 + date.getUTCMinutes(), h = BOUTIQUE.horaires[CLES[j]];
    if (h && maintenant >= minutes(h[0]) && maintenant < minutes(h[1])) return { ouvert: true, texte: "Ouvert · ferme à " + heure(h[1]) };
    if (h && maintenant < minutes(h[0])) return { ouvert: false, texte: "Fermé · ouvre à " + heure(h[0]) };
    for (let d = 1; d <= 7; d++) {
      const k = (j + d) % 7, suivant = BOUTIQUE.horaires[CLES[k]];
      if (suivant) return { ouvert: false, texte: "Fermé · ouvre " + (d === 1 ? "demain" : JOURS[k].toLowerCase()) + " à " + heure(suivant[0]) };
    }
    return { ouvert: false, texte: "Fermé" };
  }

  function rendreHoraires() {
    const aujourdhui = (new Date().getUTCDay() + 6) % 7;
    $("#horaires").innerHTML = CLES.map((cle, i) => {
      const h = BOUTIQUE.horaires[cle];
      return "<tr" + (i === aujourdhui ? ' class="auj"' : "") + '><th scope="row">' + JOURS[i] + (i === aujourdhui ? ' <span class="vh">(aujourd\'hui)</span>' : "") + "</th><td>" + (h ? plage(h) : "Fermé") + "</td></tr>";
    }).join("");
    const pastille = $("#statut");
    if (BOUTIQUE.horairesAConfirmer) { pastille.className = "statut"; pastille.textContent = "Horaires indicatifs"; }
    else { const s = statutActuel(new Date()); pastille.className = "statut " + (s.ouvert ? "ouvert" : "ferme"); pastille.textContent = s.texte; }
    $("#horaires-note").hidden = !BOUTIQUE.horairesAConfirmer;
    $$("[data-horaires-resume]").forEach((el) => { el.textContent = resumeHoraires(); });
  }

  /* ---------- Coordonnées et photos de la boutique ---------- */
  const photoVide = (legende) => '<figcaption><svg class="ic" aria-hidden="true"><use href="#i-photo"></use></svg><strong>Photo à venir</strong><span>' + esc(legende) + "</span></figcaption>";

  function rendreBoutique() {
    $$("[data-wa]").forEach((a) => { a.href = wa(MESSAGES[a.dataset.wa] || MESSAGES.general); });
    $$("[data-numero]").forEach((el) => { el.textContent = BOUTIQUE.whatsappAffiche; });
    $("#adresse").textContent = BOUTIQUE.adresse ? BOUTIQUE.adresse + ", " + BOUTIQUE.ville : BOUTIQUE.ville;
    if (/^https:\/\//i.test(BOUTIQUE.lienCarte || "")) {
      const lien = $("#lien-carte"); lien.href = BOUTIQUE.lienCarte; lien.hidden = false;
      // La position est sur la carte : plus besoin de la demander sur WhatsApp.
      $$('.contact-actions [data-wa="localisation"]').forEach((a) => { a.hidden = true; });
    }
    $("#annee").textContent = new Date().getFullYear();
    const photos = BOUTIQUE.photos || {};
    $("#photos").innerHTML = (photos.boutique || []).map((f) => '<figure class="photo">' + (f.fichier ? '<img src="' + esc(f.fichier) + '" alt="' + esc(f.legende) + '" loading="lazy" decoding="async">' : photoVide(f.legende)) + "</figure>").join("");
    if (photos.accueil) { const zone = $("#hero-visuel"); zone.classList.add("avec-photo"); zone.insertAdjacentHTML("afterbegin", '<img src="' + esc(photos.accueil) + '" alt="">'); }
  }

  let minuterie;
  function toast(texte) {
    const t = $("#toast");
    t.textContent = texte; t.hidden = false;
    clearTimeout(minuterie);
    minuterie = setTimeout(() => { t.hidden = true; }, 2400);
  }

  function copierNumero() {
    const secours = () => {
      const zone = document.createRange(), s = window.getSelection();
      zone.selectNodeContents($("#numero")); s.removeAllRanges(); s.addRange(zone);
      toast("Numéro sélectionné : vous pouvez le copier");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText("+" + BOUTIQUE.whatsapp).then(() => toast("Numéro copié"), secours);
    else secours();
  }

  /* ---------- Clics ---------- */
  const fermerMenu = () => { const m = $("#menu"); if (m.open) m.close(); };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("a, button");
    if (!t) return;
    const d = t.dataset;
    if (d.coeur) { const on = basculer(d.coeur); if (!$("dialog[open]")) toast(on ? "Ajouté à votre sélection" : "Retiré de votre sélection"); return; }
    if (d.fiche) { e.preventDefault(); ouvrirFiche(d.fiche); return; }
    if (d.retirer) { basculer(d.retirer); return; }
    if ("vider" in d) { selection.clear(); sauver(); majSelection(); return; }
    if ("fermer" in d) { t.closest("dialog").close(); return; }
    if (d.ouvrir) { const dlg = document.getElementById(d.ouvrir); if (dlg && !dlg.open) dlg.showModal(); return; }
    if (d.rayon) { e.preventDefault(); fermerMenu(); appliquer("rayon", d.rayon); return; }
    if (d.type) { appliquer("type", d.type); return; }
    if (d.occasion) { appliquer("occasion", d.occasion); return; }
    if (d.tab) { onglet = d.tab; rendreNouveautes(); return; }
    if (d.genre) { tenue.genre = d.genre; tenue.i = depart(d.genre); rendreTenue(); return; }
    if (d.piece) {
      const k = Number(d.piece);
      tenue.i[k] = (tenue.i[k] + 1) % optionsTenue(k, tenue.genre).length;
      rendreTenue();
      const bouton = $('[data-piece="' + k + '"]');
      if (bouton) { bouton.classList.add("change"); bouton.focus({ preventScroll: true }); }
      return;
    }
    if (d.couleur) { choix.couleur = choix.couleur === d.couleur ? null : d.couleur; majFiche(); return; }
    if (d.taille) { choix.taille = choix.taille === d.taille ? null : d.taille; majFiche(); return; }
    if ("copier" in d) { copierNumero(); return; }
    if (t.tagName === "A" && t.closest("#menu")) fermerMenu();
  });

  // Un clic sur le fond assombri referme la feuille.
  $$("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));

  /* ---------- Onglet actif de la barre du bas ---------- */
  const onglets = $$("[data-onglet]");
  let enAttente = false;
  function majOnglets() {
    enAttente = false;
    const repere = window.scrollY + window.innerHeight * 0.35;
    const haut = (id) => { const el = document.getElementById(id); return el ? el.getBoundingClientRect().top + window.scrollY : Infinity; };
    const actif = repere >= haut("commander") ? "" : repere >= haut("catalogue") ? "catalogue" : repere >= haut("nouveautes") ? "promos" : "accueil";
    onglets.forEach((o) => {
      const on = o.dataset.onglet === actif;
      o.classList.toggle("actif", on);
      if (on) o.setAttribute("aria-current", "true"); else o.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", () => { if (!enAttente) { enAttente = true; requestAnimationFrame(majOnglets); } }, { passive: true });

  /* ---------- Relief au survol : le vêtement suit la souris (ordinateur uniquement) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !mouvementReduit) {
    let survol = null;
    const remettre = (el) => { if (el) { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); } };
    document.addEventListener("pointermove", (e) => {
      const bloc = e.target.closest && e.target.closest(".carte, .fiche-visuel");
      const zone = bloc && (bloc.classList.contains("fiche-visuel") ? bloc : $(".carte-visuel", bloc));
      const r = zone && zone.getBoundingClientRect();
      const dedans = !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && !$("img", zone);
      if (zone !== survol || !dedans) { remettre(survol); survol = dedans ? zone : null; }
      if (!dedans) return;
      zone.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(2) + "deg");
      zone.style.setProperty("--rx", ((0.5 - (e.clientY - r.top) / r.height) * 11).toFixed(2) + "deg");
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { remettre(survol); survol = null; });
  }

  /* ---------- Démarrage ---------- */
  rendreBoutique();
  rendreHoraires();
  if (!BOUTIQUE.horairesAConfirmer) setInterval(rendreHoraires, 60000);
  rendreTenue();
  rendreNouveautes();
  rendreCatalogue();
  majOnglets();
  routeur();
})();
