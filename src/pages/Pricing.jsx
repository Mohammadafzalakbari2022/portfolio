import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import './Pricing.css'

function Pricing() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback data if DB is empty
    const defaultPlans = [
        {
            id: 1,
            title: "Starter",
            price: "$999",
            features: ["Single Page Website", "Responsive Design", "Contact Form", "1 Month Support"]
        },
        {
            id: 2,
            title: "Professional",
            price: "$2,499",
            features: ["Full Stack Web App", "Admin Dashboard", "Database Integration", "Payment Gateway", "3 Months Support"],
            recommended: true
        },
        {
            id: 3,
            title: "Enterprise",
            price: "Custom",
            features: ["Mobile App (iOS & Android)", "Complex Backend", "Real-time Features", "Scalable Architecture", "1 Year Support"]
        }
    ];

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "pricing"));
                if (!querySnapshot.empty) {
                    const pricingList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPlans(pricingList);
                } else {
                    setPlans(defaultPlans);
                }
            } catch (error) {
                console.error("Error fetching pricing: ", error);
                setPlans(defaultPlans);
            } finally {
                setLoading(false);
            }
        };

        fetchPricing();
    }, []);

    if (loading) return <div className="loading">Loading Pricing...</div>

    return (
        <div className="pricing-container">
            <div className="pricing-header">
                <h1>Invest in Quality</h1>
                <p>Transparent pricing for premium development services.</p>
            </div>

            <div className="pricing-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}>
                        {plan.recommended && <div className="badge">Best Value</div>}
                        <h3>{plan.title}</h3>
                        <div className="price">{plan.price}</div>
                        <ul className="features">
                            {plan.features?.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <a href="/contact" className="btn btn-primary btn-full">Get Started</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pricing
