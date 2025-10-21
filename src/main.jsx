import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
// import App from './App.jsx'
import StarRating from "./StarRating";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={5}
      size={24}
      className="test"
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating maxRating={10} size={24} color="blue" defaultRating={3} />

    {/* useful for when we dont want to set a props for our star component, it defaults to 5 stars */}
    <StarRating />

    <TestRating />
  </StrictMode>
);

function TestRating() {
  const [testRating, setTestRating] = useState(3);
  const maxRating = 10;

  return (
    <div>
      <StarRating
        size={24}
        onSetRating={setTestRating}
        maxRating={maxRating}
        defaultRating={testRating}
      />
      <p>
        This movie was rated {testRating}/{maxRating}
      </p>
    </div>
  );
}
