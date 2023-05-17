if ("serviceWorker" in navigator) {
    console.log("Registering service worker");
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service_worker_dynamic.js");
    });
}

const addImage = () => {
    let img = document.createElement("img");
    img.src = ("./panda.jpg");
    const div = document.createElement("div");
    div.append(img);
    document.querySelector("main").append(div);
}

document.querySelector("button")?.addEventListener("click", addImage);

