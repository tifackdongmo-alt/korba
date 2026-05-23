// app.jsx — Korba marketplace · DesignCanvas + Tweaks
// Assembles all screens into a multi-section canvas

const PHONE_W = 360;
const PHONE_H = 760;
const BRAND_W = 880;
const BRAND_H = 700;

function App() {
  const [tw, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "role": "client",
    "cards": "glass"
  }/*EDITMODE-END*/);

  // Apply tweaks to body so CSS can react
  React.useEffect(() => {
    document.body.dataset.activeRole = tw.role;
    document.body.dataset.cards = tw.cards;
  }, [tw.role, tw.cards]);

  return (
    <>
      <DesignCanvas>

        <DCSection id="brand" title="Système & marque" subtitle="Direction artistique · palette par rôle · typographie">
          <DCArtboard id="brand-system" label="01 · Identité Korba" width={BRAND_W} height={BRAND_H}>
            <BrandSystem/>
          </DCArtboard>
        </DCSection>

        <DCSection id="entry" title="Entrée" subtitle="Splash · Onboarding · Authentification">
          <DCArtboard id="splash"      label="02 · Splash"      width={PHONE_W} height={PHONE_H}><ScreenSplash/></DCArtboard>
          <DCArtboard id="onboarding"  label="03 · Onboarding"  width={PHONE_W} height={PHONE_H}><ScreenOnboarding/></DCArtboard>
          <DCArtboard id="auth"        label="04 · Connexion"   width={PHONE_W} height={PHONE_H}><ScreenAuth/></DCArtboard>
        </DCSection>

        <DCSection
          id="client"
          title="Client · orange épuré"
          subtitle="Découverte, commande, suivi temps réel, validation"
          data-role-section="client">
          <DCArtboard id="c-home"      label="05 · Accueil"        width={PHONE_W} height={PHONE_H}><ClientHome/></DCArtboard>
          <DCArtboard id="c-catalogue" label="06 · Marketplace"    width={PHONE_W} height={PHONE_H}><ClientCatalogue/></DCArtboard>
          <DCArtboard id="c-agency"    label="07 · Profil agence"  width={PHONE_W} height={PHONE_H}><ClientAgencyProfile/></DCArtboard>
          <DCArtboard id="c-product"   label="08 · Détail produit" width={PHONE_W} height={PHONE_H}><ClientProductDetail/></DCArtboard>
          <DCArtboard id="c-checkout"  label="09 · Validation"     width={PHONE_W} height={PHONE_H}><ClientCheckout/></DCArtboard>
          <DCArtboard id="c-tracking"  label="10 · Suivi temps réel" width={PHONE_W} height={PHONE_H}><ClientTracking/></DCArtboard>
          <DCArtboard id="c-delivered" label="11 · Livrée · avis"  width={PHONE_W} height={PHONE_H}><ClientDelivered/></DCArtboard>
        </DCSection>

        <DCSection
          id="vendor"
          title="Vendeur · violet"
          subtitle="Tableau de bord boutique, catalogue et préparation"
          data-role-section="vendor">
          <DCArtboard id="v-home"      label="12 · Boutique"       width={PHONE_W} height={PHONE_H}><VendorHome/></DCArtboard>
          <DCArtboard id="v-catalogue" label="13 · Mon catalogue"  width={PHONE_W} height={PHONE_H}><VendorCatalogue/></DCArtboard>
          <DCArtboard id="v-order"     label="14 · Commande reçue" width={PHONE_W} height={PHONE_H}><VendorOrderDetail/></DCArtboard>
        </DCSection>

        <DCSection
          id="agency"
          title="Agence · vert premium"
          subtitle="Pilotage flotte, profil agence, équipe et zones"
          data-role-section="agency">
          <DCArtboard id="a-dashboard" label="15 · Pilotage"       width={PHONE_W} height={PHONE_H}><AgencyDashboard/></DCArtboard>
          <DCArtboard id="a-profile"   label="16 · Profil agence"  width={PHONE_W} height={PHONE_H}><AgencyProfile/></DCArtboard>
          <DCArtboard id="a-team"      label="17 · Équipe & Zones" width={PHONE_W} height={PHONE_H}><AgencyTeamZones/></DCArtboard>
        </DCSection>

        <DCSection
          id="driver"
          title="Livreur · bleu ciel"
          subtitle="Missions, navigation embarquée, preuve de livraison"
          data-role-section="driver">
          <DCArtboard id="d-home"      label="18 · Missions"       width={PHONE_W} height={PHONE_H}><DriverHome/></DCArtboard>
          <DCArtboard id="d-nav"       label="19 · Navigation"     width={PHONE_W} height={PHONE_H}><DriverNavigation/></DCArtboard>
          <DCArtboard id="d-proof"     label="20 · Preuve livraison" width={PHONE_W} height={PHONE_H}><DriverProof/></DCArtboard>
        </DCSection>

        <DCSection id="cross" title="Transverse" subtitle="Notifications, paramètres, litige & support">
          <DCArtboard id="x-notifs"    label="21 · Notifications"  width={PHONE_W} height={PHONE_H}><NotificationsScreen/></DCArtboard>
          <DCArtboard id="x-profile"   label="22 · Mon compte"     width={PHONE_W} height={PHONE_H}><ProfileScreen/></DCArtboard>
          <DCArtboard id="x-dispute"   label="23 · Litige"         width={PHONE_W} height={PHONE_H}><DisputeScreen/></DCArtboard>
        </DCSection>

      </DesignCanvas>

      <TweaksPanel title="Tweaks · Korba">
        <TweakSection label="Rôle mis en avant">
          <TweakSelect
            label="Rôle actif"
            value={tw.role}
            onChange={v => setTweak('role', v)}
            options={[
              { value: 'client',  label: 'Client · orange'   },
              { value: 'vendor',  label: 'Vendeur · violet'  },
              { value: 'agency',  label: 'Agence · vert'     },
              { value: 'driver',  label: 'Livreur · bleu'    },
            ]}
          />
          <div style={{ fontSize: 11.5, color: '#666', marginTop: 6, lineHeight: 1.45 }}>
            Les autres sections sont atténuées sur le canvas pour mettre en avant le rôle choisi.
          </div>
        </TweakSection>

        <TweakSection label="Style des cartes">
          <TweakRadio
            label="Surfaces"
            value={tw.cards}
            onChange={v => setTweak('cards', v)}
            options={[
              { value: 'flat',   label: 'Plates'  },
              { value: 'shadow', label: 'Ombres'  },
              { value: 'glass',  label: 'Verre'   },
            ]}
          />
          <div style={{ fontSize: 11.5, color: '#666', marginTop: 6, lineHeight: 1.45 }}>
            Plates · bordures fines. Ombres · élévation douce. Verre · glassmorphism subtil.
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
