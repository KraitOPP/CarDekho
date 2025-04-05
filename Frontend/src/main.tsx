import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import {router} from "./routes";
import './index.css';
import { Provider } from "react-redux";
import store from "./app/store";

const root = document.getElementById("root");

if (root) {
    ReactDOM.createRoot(root).render(
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
} else {
    console.error("Root element not found");
}
