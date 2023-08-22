import React from 'react';
import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
            <section className="text-center p-10 text-gray-700">
                <h2 className="text-3xl font-bold mb-5">Welcome to Bug Bank - Redefining the Value of Currency, Today!</h2>
                <p className="text-xl mb-8">We're pioneers, introducing an innovative, eco-friendly system that uses bugs as a form of trade instead of money.</p>

                <p className="text-lg">
                    At BugBank, we're not just a bank; we're pioneers, blazing a trail towards a bold new concept in banking.
                    We have turned the idea of traditional banking on its head, introducing an innovative, eco-friendly system
                    that uses bugs as a form of trade instead of money.
                </p>
                <Link className="btn btn-primary" to="/auth">Join Us Today</Link>

            </section>

            <section className="grid grid-cols-2 gap-4 p-10">
                <div className="card bordered">
                    <figure>
                        <img src="/images/bug1_small.png" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Bug-Based Economy</h2>
                        <p>Our unique banking model uses bugs, one of the most sustainable and abundant resources on our planet, as a form of trade. It's banking that's not only good for you, but good for the environment too.</p>
                    </div>
                </div>

                <div className="card bordered">
                    <figure>
                        <img src="/images/bug2_small.png" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Eco-Conscious Banking</h2>
                        <p>By trading in bugs, we're reducing the demand for resource-intensive physical and digital currencies, contributing to a more sustainable and environmentally-friendly world.</p>
                    </div>
                </div>

                <div className="card bordered">
                    <figure>
                        <img src="/images/bug3_small.png" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Innovative Services</h2>
                        <p>From bug-based savings and loan services to investment and wealth management in the realm of entomology, we're transforming conventional financial services to fit our unique model.</p>
                    </div>
                </div>

                <div className="card bordered">
                    <figure>
                        <img src="/images/bug4_small.png" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Secure Bug Vaults</h2>
                        <p>Rest easy knowing your bug assets are in safe hands. Our state-of-the-art vaults provide an ideal environment for your bugs, complete with controlled temperature, humidity, and appropriate food resources.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;