import React from "react";

const Privacy = () => {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11">
          <div className="bg-white rounded-4 p-4 p-md-5 border">
            <h1 className="display-5 fw-bold mb-3 text-dark">Privacy Policy</h1>
            <p className="text-secondary mb-5">
              <small>Last updated: {lastUpdated}</small>
            </p>

            <section className="mb-5">
              <h2 className="h4 fw-semibold text-primary mb-3">
                1. Introduction
              </h2>
              <p className="text-muted">
                At <strong>The Post</strong>, your privacy is important to us.
                This policy explains how we collect, use, and protect your
                personal data when you interact with our services.
              </p>
            </section>

            <section className="mb-5">
              <h2 className="h4 fw-semibold text-primary mb-3">
                2. Data We Collect
              </h2>
              <p className="text-muted mb-2">
                We may collect the following personal data:
              </p>
              <ul className="text-muted ps-4">
                <li>Identity Data (e.g., name, username)</li>
                <li>Contact Data (e.g., email address)</li>
                <li>Technical Data (e.g., IP address, browser type)</li>
                <li>Usage Data (e.g., site interactions)</li>
                <li>Marketing and Communication Preferences</li>
              </ul>
            </section>

            <section className="mb-5">
              <h2 className="h4 fw-semibold text-primary mb-3">
                3. How We Use Your Data
              </h2>
              <p className="text-muted mb-2">
                We process your personal data to:
              </p>
              <ul className="text-muted ps-4">
                <li>Provide and enhance our services</li>
                <li>Manage user accounts</li>
                <li>Personalize user experience</li>
                <li>Send newsletters (when subscribed)</li>
                <li>Monitor and analyze website usage</li>
              </ul>
            </section>

            <section className="mb-5">
              <h2 className="h4 fw-semibold text-primary mb-3">
                4. Data Security
              </h2>
              <p className="text-muted">
                We apply robust security measures to safeguard your personal
                information from unauthorized access, alteration, or disclosure.
                Access is restricted to authorized personnel only.
              </p>
            </section>

            <section className="mb-5">
              <h2 className="h4 fw-semibold text-primary mb-3">
                5. Your Legal Rights
              </h2>
              <p className="text-muted">
                You have the right to access, correct, delete, or restrict use
                of your data, and to withdraw your consent at any time under
                applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="h4 fw-semibold text-primary mb-3">
                6. Contact Us
              </h2>
              <p className="text-muted mb-1">
                If you have any questions about our privacy practices or this
                policy, feel free to reach out:
              </p>
              <p className="text-muted">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@thepost.com"
                  className="text-decoration-none text-primary"
                >
                  privacy@thepost.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
