import "bootstrap/dist/js/bootstrap.bundle.min";
import * as bootstrap from "bootstrap";
//import 'bootstrap/dist/css/bootstrap.css';
export default defineNuxtPlugin(() => {
	return {
		provide: {
			bootstrap: bootstrap,
		},
	};
});
