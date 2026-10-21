import Buddy from "./features/buddy";
import { Provider } from "./components/provider";

function App() {
  return (
    <Provider>
      <Buddy />
    </Provider>
  );
}

export default App;
