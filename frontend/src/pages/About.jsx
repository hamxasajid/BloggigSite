import React from "react";

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-white text-center py-5"
        style={{
          background:
            "linear-gradient(rgba(13, 110, 253, 0.8), rgba(13, 110, 253, 0.8)), rgba(13, 110, 253, 0.8)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">About The Post</h1>
          <p className="lead mt-3">
            Discover who we are, what drives us, and how we’re building a
            platform for curious minds.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="mb-4 text-primary">Our Mission</h2>
          <p className="fs-5">
            At <strong>The Post</strong>, our mission is to empower individuals
            through thoughtful writing, inspiring ideas, and a diverse range of
            perspectives. We believe stories have the power to shape minds,
            spark change, and build communities.
          </p>
          <p className="fs-5">
            Whether you're a reader or writer, we’re here to help you explore
            the world, question the norm, and grow intellectually—one post at a
            time.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 text-primary">What We Offer</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Engaging Blogs</h5>
                  <p className="card-text">
                    Dive into original content written by passionate authors
                    covering a wide range of topics including tech, education,
                    lifestyle, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Creative Freedom</h5>
                  <p className="card-text">
                    Writers have the freedom to express their voice. We
                    encourage authentic storytelling, diverse opinions, and
                    thoughtful dialogue.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Reader-First Design</h5>
                  <p className="card-text">
                    A clean, responsive, and distraction-free reading experience
                    optimized for clarity, comfort, and curiosity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
