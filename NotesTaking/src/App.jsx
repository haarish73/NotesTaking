import React, { useState } from "react";
import Notes from "./Page/Notes"
import Topics from "./Page/Topic"
function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return selectedTopic ? (
    <Notes topic={selectedTopic} goBack={() => setSelectedTopic(null)} />
  ) : (
    <Topics setSelectedTopic={setSelectedTopic} />
  );
}

export default App;