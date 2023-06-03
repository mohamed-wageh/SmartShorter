import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

function App() {
  const [shortLinks, setShortLinks] = useState([]);
  const [newSlug, setNewSlug] = useState("");
  const [newIosPrimary, setNewIosPrimary] = useState("");
  const [newIosFallback, setNewIosFallback] = useState("");
  const [newAndroidPrimary, setNewAndroidPrimary] = useState("");
  const [newAndroidFallback, setNewAndroidFallback] = useState("");
  const [newWeb, setNewWeb] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/shortlinks")
      .then((response) => {
        setShortLinks(response.data.shortlinks);
      })
      .catch((error) => {
        console.error("Error fetching short links:", error);
      });
  }, []);

  // Create a new short link
  const createShortLink = () => {
    const newShortLink = {
      slug: newSlug,
      ios: {
        primary: newIosPrimary,
        fallback: newIosFallback,
      },
      android: {
        primary: newAndroidPrimary,
        fallback: newAndroidFallback,
      },
      web: newWeb,
    };

    axios
      .post("http://localhost:5000/shortlinks", newShortLink)
      .then((response) => {
        setShortLinks([...shortLinks, response.data]);
        setNewSlug("");
        setNewIosPrimary("");
        setNewIosFallback("");
        setNewAndroidPrimary("");
        setNewAndroidFallback("");
        setNewWeb("");
      })
      .catch((error) => {
        console.error("Error creating short link:", error);
      });
  };
  const handleLinkClick = (slug) => {
    axios
      .put(`http://localhost:5000/shortlinks/${slug}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching short links:", error);
      });
  };
const updateShortLink = (slug) => {
  const updatedShortLink = {
    ios: {
      fallback: newIosFallback,
    },
  };

  axios
    .put(`http://localhost:5000/shortlinks/${slug}`, updatedShortLink)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error("Error updating short link:", error);
    });
};
  return (
    <div className="container">
      <h1>Short Links</h1>

      {/* Create Short Link Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createShortLink();
        }}
        className="my-4 form-inline"
      >
        <label htmlFor="slug">Slug (optional):</label>
        <input
          type="text"
          placeholder="Slug"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          className="form-control col mr-2 mb-2"
        />

        <label htmlFor="iosPrimary">iOS Primary:</label>
        <input
          type="url"
          placeholder="iOS Primary"
          value={newIosPrimary}
          onChange={(e) => setNewIosPrimary(e.target.value)}
          required
          className="form-control col mr-2 mb-2"
        />

        <label htmlFor="iosFallback">iOS Fallback:</label>
        <input
          type="url"
          placeholder="iOS Fallback"
          value={newIosFallback}
          onChange={(e) => setNewIosFallback(e.target.value)}
          required
          className="form-control col mr-2 mb-2"
        />

        <label htmlFor="androidPrimary">Android Primary:</label>
        <input
          type="url"
          placeholder="Android Primary"
          value={newAndroidPrimary}
          onChange={(e) => setNewAndroidPrimary(e.target.value)}
          required
          className="form-control col mr-2 mb-2"
        />

        <label htmlFor="androidFallback">Android Fallback:</label>
        <input
          type="url"
          placeholder="Android Fallback"
          value={newAndroidFallback}
          onChange={(e) => setNewAndroidFallback(e.target.value)}
          required
          className="form-control col mr-2 mb-2"
        />

        <label htmlFor="web">Web:</label>
        <input
          type="url"
          placeholder="Web"
          value={newWeb}
          onChange={(e) => setNewWeb(e.target.value)}
          required
          className="form-control col mr-2 mb-2"
        />

        <button type="submit" className="btn btn-success">
          Create
        </button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateShortLink(newSlug); // Pass the slug of the short link to be updated
        }}
        className="my-4 form-inline"
      >
        {/* Form inputs for updating a short link */}
        <label htmlFor="slugToUpdate">Slug to Update:</label>
        <input
          type="text"
          placeholder="Slug"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          className="form-control col mr-2 mb-2"
        />

        <label htmlFor="iosFallbackToUpdate">iOS Fallback (Update):</label>
        <input
          type="url"
          placeholder="iOS Fallback"
          value={newIosFallback}
          onChange={(e) => setNewIosFallback(e.target.value)}
          required
          className="form-control col mr-2 mb-2"
        />

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>

      {/* Short Links Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Full URL</th>
          </tr>
        </thead>
        <tbody>
          {shortLinks?.map((shortLink) => (
            <tr key={shortLink._id}>
              <td>
                <button
                  onClick={() => handleLinkClick(shortLink.slug)}
                  className="btn-link"
                >
                  {shortLink.slug}
                </button>
              </td>
              <td>
                <a href={shortLink.web}>{shortLink.web}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
