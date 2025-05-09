import React from "react";

const Cookies = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h1 className="h2 fw-bold mb-4">Cookies Policy</h1>
              <p className="text-muted mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3">1. What Are Cookies</h2>
                <p className="text-muted">
                  Cookies are small text files stored on your device when you
                  visit websites. They help the website remember information
                  about your visit, which can make it easier to visit the site
                  again and make the site more useful to you.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3">2. How We Use Cookies</h2>
                <p className="text-muted">
                  We use cookies for various purposes including:
                </p>
                <ul className="text-muted">
                  <li>
                    <strong>Essential Cookies:</strong> Necessary for the
                    website to function
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how
                    visitors interact with our site
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> Remember your
                    preferences
                  </li>
                  <li>
                    <strong>Targeting Cookies:</strong> Used for advertising
                    purposes
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3">3. Third-Party Cookies</h2>
                <p className="text-muted">
                  We may also use various third-party cookies for analytics and
                  advertising purposes, including:
                </p>
                <ul className="text-muted">
                  <li>Google Analytics</li>
                  <li>Facebook Pixel</li>
                  <li>Twitter Analytics</li>
                </ul>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3">4. Managing Cookies</h2>
                <p className="text-muted">
                  You can control and/or delete cookies as you wish. You can
                  delete all cookies that are already on your computer and you
                  can set most browsers to prevent them from being placed.
                  However, if you do this, you may have to manually adjust some
                  preferences every time you visit a site and some services and
                  functionalities may not work.
                </p>
              </div>

              <div>
                <h2 className="h4 fw-bold mb-3">5. Changes to This Policy</h2>
                <p className="text-muted">
                  We may update our Cookies Policy from time to time. We will
                  notify you of any changes by posting the new Cookies Policy on
                  this page and updating the "Last updated" date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
