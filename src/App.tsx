import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("accueil");
  const [sacs, setSacs] = useState<any[]>([]);
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);
  const [panier, setPanier] = useState<any[]>([]);
  const [paiement, setPaiement] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    email: "",
    mode: "carte",
    numeroCarte: "",
    codeCarte: "",
    numeroMobile: ""
  });
  const [facture, setFacture] = useState<any | null>(null);

  // Charger les sacs depuis sacs.json
  useEffect(() => {
    fetch("/data/sacs.json")
      .then(res => res.json())
      .then(data => setSacs(data))
      .catch(err => console.error("Erreur chargement JSON:", err));
  }, []);

  // Ajouter au panier avec gestion de quantité
  const ajouterAuPanier = (sac: any) => {
    const existe = panier.find(item => item.id === sac.id);
    if (existe) {
      setPanier(prev =>
        prev.map(item =>
          item.id === sac.id ? { ...item, quantite: (item.quantite || 1) + 1 } : item
        )
      );
    } else {
      setPanier(prev => [...prev, { ...sac, quantite: 1 }]);
    }
    setPage("panier");
  };

  return (
    <div className="app">
      {/* --- Navigation --- */}
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.JPG" alt="Sac Chic" />
          <h2>ShopBags</h2>
        </div>
        <ul className="nav-links">
          <li onClick={() => setPage("accueil")}>Accueil</li>
          <li onClick={() => setPage("categories")}>Catégories</li>
          <li onClick={() => setPage("panier")}>
            Panier {panier.length > 0 && `(${panier.length})`}
          </li>
          <li onClick={() => setPage("a-propos")}>À propos</li>
        </ul>
      </nav>

      <main className="content">
        {/* === ACCUEIL === */}
        {page === "accueil" && (
          <div className="home">
            <section className="banniere">
              <img src="/images/banniere.jpg" alt="Intérieur boutique" className="banniere-img" />
              <div className="banniere-texte">
                <h1>Bienvenue chez <span className="brand">ShopBags</span></h1>
                <p>Découvrez l’élégance au bout de vos mains !</p>
              </div>
            </section>

            <section className="produits">
              <h2>Nos sacs phares</h2>
              <div className="grid">
                {sacs.slice(0, 6).map(sac => (
                  <div className="card" key={sac.id}>
                    <img src={sac.image} alt={sac.nom} />
                    <h3>{sac.nom}</h3>
                    <p className="prix">{sac.prix.toLocaleString()} FCFA</p>
                    
                  </div>
                ))}
              </div>
            </section>

            <section className="collection-automne">
              <h2>🍂 Notre Collection d’Automne</h2>
              <div className="grid">
                {sacs.filter(sac => sac.categorie === "automne").map(sac => (
                  <div key={sac.id} className="card">
                    <img src={sac.image} alt={sac.nom} />
                    <h3>{sac.nom}</h3>
                    <p><strong>{sac.prix.toLocaleString()} FCFA</strong></p>
                    
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* === CATEGORIES === */}
        {page === "categories" && (
          <div className="categories-page">
            <h1>Nos Catégories</h1>
            <div className="categories-layout">
              <aside className="sidebar">
                <ul>
                  {["sacs-a-main","cabas","a-dos","pochette","bandoulière","sacs-de-sport","tote bags"].map(cat => (
                    <li
                      key={cat}
                      className={cat === selectedCategorie ? "active" : ""}
                      onClick={() => setSelectedCategorie(cat)}
                    >
                      {cat === "sacs-a-main" && "👜 Sacs à main"}
                      {cat === "cabas" && "👜 Sacs cabas"}
                      {cat === "a-dos" && "🎒 Sacs à dos femmes"}
                      {cat === "pochette" && "💃 Sacs de soirée"}
                      {cat === "bandoulière" && "🛍️ Sacs à bandoulière"}
                      {cat === "sacs-de-sport" && "🏋️ Sacs de sport femmes"}
                      {cat === "tote bags" && "🎀 Sacs tote bags"}
                    </li>
                  ))}
                </ul>
              </aside>

              <section className="categorie-produits">
                {selectedCategorie ? (
                  <>
                    <h2>
                      {selectedCategorie === "sacs-a-main" && "Sacs à main"}
                      {selectedCategorie === "cabas" && "Sacs cabas"}
                      {selectedCategorie === "a-dos" && "Sacs à dos"}
                      {selectedCategorie === "pochette" && "Sacs de soirée"}
                      {selectedCategorie === "bandoulière" && "Sacs à bandoulière"}
                      {selectedCategorie === "sacs-de-sport" && "Sacs de sport"}
                      {selectedCategorie === "tote bags" && "Sacs tote bags"}
                    </h2>
                    <div className="grid">
                      {sacs.filter(sac => sac.categorie === selectedCategorie).map(sac => (
                        <div key={sac.id} className="card">
                          <img src={sac.image} alt={sac.nom} />
                          <h3>{sac.nom}</h3>
                          <p className="description">{sac.description}</p>
                          <p><strong>{sac.prix.toLocaleString()} FCFA</strong></p>
                          <button onClick={() => ajouterAuPanier(sac)}>Ajouter au panier</button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <p className="message">Choisissez une catégorie à gauche 👈</p>}
              </section>
            </div>
          </div>
        )}

        {/* === PANIER === */}
        {page === "panier" && (
          <div className="panier-page">
            <h1 className="panier-titre">🛍️ Votre Panier</h1>
            {panier.length === 0 ? (
              <p className="message">Votre panier est vide 😢</p>
            ) : (
              <>
                <div className="panier-container">
                  {panier.map(item => (
                    <div key={item.id} className="panier-card">
                      <img src={item.image} alt={item.nom} className="panier-image" />
                      <div className="panier-details">
                        <h3>{item.nom}</h3>
                        <p className="prix">{(item.prix * (item.quantite||1)).toLocaleString()} FCFA</p>
                        <p className="description">{item.description}</p>

                        <div className="quantite-controls">
                          <button onClick={() => setPanier(prev => prev.map(p => 
                            p.id === item.id ? {...p, quantite: Math.max(1, (p.quantite||1)-1)} : p
                          ))}>-</button>
                          <span>{item.quantite||1}</span>
                          <button onClick={() => setPanier(prev => prev.map(p => 
                            p.id === item.id ? {...p, quantite: (p.quantite||1)+1} : p
                          ))}>+</button>
                        </div>

                        <button className="supprimer-btn" onClick={() => setPanier(prev => prev.filter(p => p.id !== item.id))}>
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="panier-total">
                  <h2>Total : {panier.reduce((sum,item) => sum + item.prix * (item.quantite||1),0).toLocaleString()} FCFA</h2>
                  <button className="payer-btn" onClick={() => setPage("paiement")}>Procéder au paiement 💳</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* === PAIEMENT === */}
        {page === "paiement" && (
          <div className="paiement-page">
            <h1 className="paiement-titre">💳 Procéder au paiement</h1>
            {facture ? (
              <div className="facture">
                <h2>✅ Votre commande a été enregistrée !</h2>
                <p><strong>Nom :</strong> {facture.nom} {facture.prenom}</p>
                <p><strong>Adresse :</strong> {facture.adresse}</p>
                <p><strong>Email :</strong> {facture.email}</p>
                <p><strong>Mode de paiement :</strong> {facture.mode}</p>
                {(facture.mode === "carte") && <p><strong>Numéro de carte :</strong> {facture.numeroCarte}</p>}
                {(facture.mode === "wave" || facture.mode === "orange") && <p><strong>Numéro mobile :</strong> {facture.numeroMobile}</p>}
                <p><strong>Total :</strong> {panier.reduce((sum,item) => sum + item.prix * (item.quantite||1),0).toLocaleString()} FCFA</p>
                <p>📧 Vous recevrez un message sur votre mail avec les détails de la commande.</p>
              </div>
            ) : (
              <form className="paiement-form" onSubmit={e => { e.preventDefault(); setFacture(paiement); }}>
                <input type="text" placeholder="Nom" value={paiement.nom} required onChange={e => setPaiement({...paiement, nom:e.target.value})} />
                <input type="text" placeholder="Prénom" value={paiement.prenom} required onChange={e => setPaiement({...paiement, prenom:e.target.value})} />
                <input type="text" placeholder="Adresse de livraison" value={paiement.adresse} required onChange={e => setPaiement({...paiement, adresse:e.target.value})} />
                <input type="email" placeholder="Email" value={paiement.email} required onChange={e => setPaiement({...paiement, email:e.target.value})} />

                <select value={paiement.mode} onChange={e => setPaiement({...paiement, mode:e.target.value})}>
                  <option value="carte">Carte bancaire</option>
                  <option value="wave">WAVE</option>
                  <option value="orange">Orange Money</option>
                </select>

                {paiement.mode === "carte" && (
                  <>
                    <input type="text" placeholder="Numéro de carte" value={paiement.numeroCarte} required onChange={e => setPaiement({...paiement, numeroCarte:e.target.value})} />
                    <input type="text" placeholder="Code de carte" value={paiement.codeCarte} required onChange={e => setPaiement({...paiement, codeCarte:e.target.value})} />
                  </>
                )}

                {(paiement.mode === "wave" || paiement.mode === "orange") && (
                  <input type="text" placeholder="Numéro de compte mobile" value={paiement.numeroMobile} required onChange={e => setPaiement({...paiement, numeroMobile:e.target.value})} />
                )}

                <button type="submit">Valider le paiement</button>
              </form>
            )}
          </div>
        )}

        {page === "a-propos" && (
  <div className="about-page">
    <h1 className="about-title">🌸 À propos de ShopBags</h1>

    {/* --- Section Histoire --- */}
    <section className="about-section histoire">
      <h2> Qui sommes-nous ?</h2>
      <p>
        ShopBags est une boutique en ligne spécialisée dans la vente de sacs pour femmes de toutes catégories : sacs à main, cabas, sacs à dos, pochettes, bandoulières, sacs de sport et tote bags. 
        Fondée par une passionnéed e mode et d’élégance, ShopBags s’inspire des dernières tendances internationales tout en restant proche des besoins quotidiens de ses clientes. 
      </p>
      <p>
         Notre objectif est d’apporter beauté, praticité et qualité dans la vie de chaque femme.
      </p>
    </section>

    {/* --- Section Mission --- */}
    <section className="about-section mission">
      <h2>Notre mission</h2>
      <p>
        Chez ShopBags, notre mission est claire : permettre à chaque femme de trouver le sac parfait qui allie style, qualité et fonctionnalité. 
        Nous nous engageons à offrir des produits tendance, durables et accessibles, afin que chaque achat soit un vrai plaisir.
      </p>
      
    </section>

    {/* --- Section Valeurs --- */}
    <section className="about-section valeurs">
      <h2> Nos valeurs</h2>
      <ul>
        <li> <strong>Qualité :</strong> Tous nos sacs sont soigneusement sélectionnés pour leur durabilité, leur finition et leur design unique.</li>
        <li> <strong>Confiance :</strong> Nous valorisons la transparence, le respect des délais de livraison et une communication claire avec nos clientes.</li>
        <li> <strong>Éthique :</strong> Nous nous efforçons de travailler avec des fournisseurs respectueux de l’environnement et des normes sociales.</li>
        <li> <strong>Style :</strong> Nous suivons de près les tendances pour offrir des sacs élégants et adaptés à tous les goûts et occasions.</li>
      </ul>
    </section>

    {/* --- Section Pourquoi nous choisir --- */}
    <section className="about-section pourquoi">
      <h2> Pourquoi acheter chez ShopBags ?</h2>
      <p>
        Acheter chez ShopBags, c’est choisir une boutique qui met la cliente au centre de toutes ses décisions. Voici ce qui nous distingue :
      </p>
      <ul>
        <li>  -Une large gamme de sacs pour toutes les occasions et tous les styles.</li>
        <li>  -Des produits de qualité, sélectionnés avec soin.</li>
        <li>  -Un service client réactif et attentionné, disponible pour répondre à vos questions.</li>
        <li>  -Des paiements sécurisés et simples via carte bancaire, WAVE ou Orange Money.</li>
        <li>  -Une livraison rapide et fiable directement chez vous, pour que votre achat arrive en toute sécurité.</li>
      </ul>
      <p>
        ShopBags n’est pas seulement une boutique en ligne : c’est un partenaire pour révéler votre style, vous accompagner au quotidien et rendre chaque achat agréable et inspirant.
      </p>
    </section>

    {/* --- Footer / Call to action --- */}
    <section className="about-cta">
      <p>
        Explorez nos collections et trouvez le sac qui vous correspond !
      </p>
      <button onClick={() => setPage("accueil")}> Retour à l’accueil</button>
    </section>
  </div>
)}


      </main>
    </div>
  );
}

export default App;
