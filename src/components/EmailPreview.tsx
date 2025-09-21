import React from "react";

interface EmailPreviewProps {
  senderName?: string;
  senderEmail?: string;
}

export function EmailPreview({ senderName = "Fioul 24", senderEmail = "commandes@fioulfrance24.fr" }: EmailPreviewProps) {
  // Mock order data for preview
  const mockOrderData = {
    orderNumber: "TF-2024-001234",
    product: {
      displayName: "Fioul Premium EL",
      pricePerLiter: 89
    },
    quantity: 2000,
    subtotal: 178000,
    deliveryFee: 0,
    totalPrice: 178000,
    firstName: "Marie",
    lastName: "Martin",
    street: "123 rue de la Paix",
    zipCode: "75001",
    city: "Paris"
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <style>{`
        .email-preview body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .email-preview .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .email-preview .header {
          background: linear-gradient(135deg, #ea580c, #dc2626);
          color: white;
          padding: 32px 24px;
          text-align: center;
        }
        .email-preview .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .email-preview .content {
          padding: 24px;
        }
        .email-preview .success-badge {
          background: linear-gradient(135deg, #ea580c, #dc2626);
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          text-align: center;
          margin-bottom: 24px;
          font-weight: 600;
        }
        .email-preview .order-details {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .email-preview .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .email-preview .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
          font-weight: bold;
        }
        .email-preview .steps {
          margin: 24px 0;
        }
        .email-preview .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .email-preview .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ea580c, #dc2626);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .email-preview .step-text {
          color: #6b7280;
          font-size: 14px;
        }
        .email-preview .footer {
          background-color: #f9fafb;
          padding: 20px 24px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .email-preview .delivery-time {
          background: linear-gradient(135deg, #ea580c, #dc2626);
          color: white;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
          margin: 16px 0;
          font-weight: 600;
        }
      `}</style>
      
      <div className="email-preview">
        <div className="container">
          <div className="header">
            <h1>Fioul 24 - Confirmation de commande</h1>
            <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Commande #{mockOrderData.orderNumber}</p>
          </div>
          
          <div className="content">
            <div className="success-badge">
              Autorisation carte réussie - Paiement à la livraison
            </div>
            
            <p>Merci pour votre commande ! L'autorisation de votre carte a réussi et le paiement s'effectue directement lors du remplissage.</p>
            
            <div className="delivery-time">
              Délai de livraison estimé : 2-3 jours ouvrés
            </div>
            
            <h3>Résumé de la commande</h3>
            <div className="order-details">
              <div className="detail-row">
                <span>Produit :</span>
                <span>{mockOrderData.product.displayName}</span>
              </div>
              <div className="detail-row">
                <span>Quantité :</span>
                <span>{mockOrderData.quantity} Litres</span>
              </div>
              <div className="detail-row">
                <span>Prix par litre :</span>
                <span>{(mockOrderData.product.pricePerLiter / 100).toFixed(2)} €</span>
              </div>
              <div className="detail-row">
                <span>Sous-total :</span>
                <span>{(mockOrderData.subtotal / 100).toFixed(2)} €</span>
              </div>
              <div className="detail-row">
                <span>Frais de livraison :</span>
                <span>{mockOrderData.deliveryFee > 0 ? `${(mockOrderData.deliveryFee / 100).toFixed(2)} €` : 'Gratuit'}</span>
              </div>
              <div className="detail-row">
                <span>Prix total (TTC) :</span>
                <span>{(mockOrderData.totalPrice / 100).toFixed(2)} €</span>
              </div>
            </div>
            
            <h3>Adresse de livraison</h3>
            <div className="order-details">
              <p style={{ margin: 0 }}>
                {mockOrderData.firstName} {mockOrderData.lastName}<br />
                {mockOrderData.street}<br />
                {mockOrderData.zipCode} {mockOrderData.city}
              </p>
            </div>
            
            <h3>Prochaines étapes</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">Nous vérifions votre commande et confirmons la date de livraison par e-mail</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">Notre équipe de livraison vous contacte avant la livraison</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">Le paiement s'effectue directement lors du remplissage</div>
              </div>
            </div>
          </div>
          
          <div className="footer">
            <p>Pour toute question concernant votre commande, vous pouvez nous contacter à tout moment.</p>
            <div style={{ margin: "20px 0", padding: "16px", backgroundColor: "#f3f4f6", borderRadius: "6px", fontSize: "12px", color: "#6b7280" }}>
              <strong>Fuel 2000 Transports Sàrl</strong><br />
              23 rue de la Porte d'Aubervilliers, 75018 Paris, France<br />
              SIREN: 500830567 | SIRET: 50083056700011<br />
              E-Mail: contact@fioulfrance24.fr | Website: https://fioulfrance24.fr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}