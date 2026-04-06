import {createStore} from "vuex";
import { postModule } from "@/store/postModule.js";

export default createStore({
    modules: {
        post: postModule
    }
});