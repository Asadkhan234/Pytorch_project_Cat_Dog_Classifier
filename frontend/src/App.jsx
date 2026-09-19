
import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // HANDLE FILE
  // ============================================

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a JPG, JPEG, or PNG image.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  // ============================================
  // FILE INPUT
  // ============================================

  const handleFileInput = (event) => {
    const file = event.target.files[0];

    handleFile(file);
  };

  // ============================================
  // DRAG EVENTS
  // ============================================

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const file = event.dataTransfer.files[0];

    handleFile(file);
  };

  // ============================================
  // PREDICT
  // ============================================

 
const analyzeImage = async () => {
  if (!selectedFile) {
    setError("Please select an image first.");
    return;
  }

  setLoading(true);
  setResult(null);
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await fetch(
      "https://pytorch-project-cat-dog-classifier.onrender.com/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Prediction request failed.");
    }

    const data = await response.json();

    setResult(data);

  } catch (error) {
    console.error(error);

    setError(
      "Could not connect to the AI server. Please try again."
    );

  } finally {
    setLoading(false);
  }
};


  // ============================================
  // RESET
  // ============================================

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="app">

      {/* Background decorations */}

      <div className="background-circle circle-one"></div>

      <div className="background-circle circle-two"></div>


      <main className="container">

        {/* ======================================
            HEADER
        ====================================== */}

        <section className="hero">

          <div className="logo">
            🐾
          </div>

          <div className="badge">
            AI PET CLASSIFIER
          </div>

          <h1>
            Is it a{" "}
            <span className="gradient-text">
              Cat
            </span>{" "}
            or a{" "}
            <span className="gradient-text">
              Dog
            </span>
            ?
          </h1>

          <p>
            Upload a pet image and let our
            PyTorch AI model identify your
            furry friend.
          </p>

        </section>


        {/* ======================================
            UPLOAD CARD
        ====================================== */}

        {!preview && (

          <section
            className={`upload-card ${
              dragging ? "dragging" : ""
            }`}

            onDragOver={handleDragOver}

            onDragLeave={handleDragLeave}

            onDrop={handleDrop}
          >

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              id="file-upload"
              onChange={handleFileInput}
            />

            <label
              htmlFor="file-upload"
              className="upload-content"
            >

              <div className="upload-icon">
                📷
              </div>

              <h2>
                Drop your image here
              </h2>

              <p>
                or{" "}
                <span>
                  browse files
                </span>
              </p>

              <small>
                JPG, JPEG or PNG
              </small>

            </label>

          </section>

        )}


        {/* ======================================
            IMAGE PREVIEW
        ====================================== */}

        {preview && (

          <section className="preview-card">

            <div className="preview-header">

              <div>
                <span className="preview-label">
                  IMAGE PREVIEW
                </span>

                <h2>
                  Your pet
                </h2>
              </div>

              <button
                className="change-button"
                onClick={reset}
              >
                Change
              </button>

            </div>


            <div className="image-wrapper">

              <img
                src={preview}
                alt="Selected pet"
              />

            </div>


            {/* ==================================
                ANALYZE BUTTON
            ================================== */}

            {!result && (

              <button
                className="analyze-button"
                onClick={analyzeImage}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    🔍 Analyze Image
                  </>
                )}

              </button>

            )}

          </section>

        )}


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="error-message">
            ⚠️ {error}
          </div>

        )}


        {/* ======================================
            RESULT
        ====================================== */}

        {result && (

          <section className="result-card">

            <div className="result-icon">

              {result.prediction === "Cat"
                ? "🐱"
                : "🐶"}

            </div>


            <div className="result-label">
              AI PREDICTION
            </div>


            <h2 className="result-name">
              {result.prediction}
            </h2>


            <p className="confidence">
              {result.confidence.toFixed(2)}%
              confidence
            </p>


            <div className="confidence-track">

              <div
                className="confidence-fill"
                style={{
                  width: `${result.confidence}%`,
                }}
              />

            </div>


            <div className="result-message">

              The AI thinks this image is a{" "}
              <strong>
                {result.prediction}
              </strong>
              .

            </div>


            <button
              className="try-again"
              onClick={reset}
            >
              ↻ Try Another Image
            </button>

          </section>

        )}


        {/* ======================================
            FOOTER
        ====================================== */}

        <footer>

          <span>
            🐾 PetVision AI
          </span>

          <span>
            Powered by PyTorch
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;
