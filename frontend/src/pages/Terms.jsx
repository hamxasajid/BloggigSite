import React from "react";

const Terms = () => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              <header className="mb-4">
                <h1 className="display-5 fw-bold">Terms of Service</h1>
                <p className="text-muted fs-6">Last updated: {currentDate}</p>
              </header>

              <article className="mb-5">
                <h2 className="h5 fw-bold mb-2">1. Acceptance of Terms</h2>
                <p className="text-muted">
                  By accessing or using The Post website, you agree to be bound
                  by these Terms of Service. If you disagree with any part of
                  the terms, you may not access the service.
                </p>
              </article>

              <article className="mb-5">
                <h2 className="h5 fw-bold mb-2">2. User Responsibilities</h2>
                <p className="text-muted">
                  You agree not to use the service to:
                </p>
                <ul className="text-muted ps-3">
                  <li>Post unlawful, harmful, or abusive content</li>
                  <li>Impersonate any person or entity</li>
                  <li>
                    Violate any local, state, national, or international law
                  </li>
                  <li>Upload viruses or malicious code</li>
                  <li>Collect data from other users without consent</li>
                </ul>
              </article>

              <article className="mb-5">
                <h2 className="h5 fw-bold mb-2">3. Intellectual Property</h2>
                <p className="text-muted">
                  All content, features, and functionality of The Post are owned
                  by us and protected by international copyright, trademark, and
                  other intellectual property laws.
                </p>
              </article>

              <article className="mb-5">
                <h2 className="h5 fw-bold mb-2">4. User Content</h2>
                <p className="text-muted">
                  You retain ownership of content you post. By submitting it,
                  you grant us a non-exclusive, royalty-free license to use,
                  reproduce, modify, and display the content.
                </p>
              </article>

              <article className="mb-5">
                <h2 className="h5 fw-bold mb-2">5. Termination</h2>
                <p className="text-muted">
                  We may terminate or suspend your access at any time, without
                  notice, for any reason, including a breach of these Terms.
                </p>
              </article>

              <article className="mb-5">
                <h2 className="h5 fw-bold mb-2">6. Limitation of Liability</h2>
                <p className="text-muted">
                  The Post and its affiliates shall not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages.
                </p>
              </article>

              <article>
                <h2 className="h5 fw-bold mb-2">7. Governing Law</h2>
                <p className="text-muted">
                  These Terms shall be governed by the laws of the State of New
                  York, without regard to conflict of law principles.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
