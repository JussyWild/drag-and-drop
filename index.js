function generateColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function enterDroppable(elem) {
    elem.style.background = "pink";
}

function leaveDroppable(elem) {
    elem.style.background = "";
}

function onPointerDown(e) {
    const dragElement = e.currentTarget;
    dragElement.removeAttribute("id");
    const shiftX = e.clientX - dragElement.getBoundingClientRect().left;
    const shiftY = e.clientY - dragElement.getBoundingClientRect().top;

    dragElement.style.position = "absolute";
    dragElement.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
        dragElement.style.left = pageX - shiftX + "px";
        dragElement.style.top = pageY - shiftY + "px";
    }

    moveAt(e.pageX, e.pageY);
    document.body.append(dragElement);

    let currentDroppable = null;

    function onPointerMove(event) {
        moveAt(event.pageX, event.pageY);

        dragElement.hidden = true;
        const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        dragElement.hidden = false;

        if (!elemBelow) return;

        const droppableBelow = elemBelow.closest(".droppable");

        if (currentDroppable != droppableBelow) {
            if (currentDroppable) {
                leaveDroppable(currentDroppable);
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
                enterDroppable(currentDroppable);
            }
        }
    }

    document.addEventListener("pointermove", onPointerMove);

    dragElement.onpointerup = function(event) {
        document.removeEventListener("pointermove", onPointerMove);
        dragElement.onpointerup = null;
        dragElement.onpointerdown = null;

        if (currentDroppable != null) {
            if (currentDroppable.classList.contains("container_fixed")) {
                dragElement.style.top = "";
                dragElement.style.left = "";
                dragElement.style.position = "";

                currentDroppable.appendChild(dragElement.cloneNode());
            } else if (currentDroppable.classList.contains("container_sticky")) {
                const boxField = currentDroppable.getBoundingClientRect();
                dragElement.style.top = event.clientY - boxField.top - shiftY + "px";
                dragElement.style.left = event.clientX - boxField.left - shiftX + "px";

                currentDroppable.appendChild(dragElement.cloneNode());
            }

            leaveDroppable(currentDroppable);
        }

        dragElement.outerHTML = "";
    };

    createElement();
}

function createElement() {
    const element = document.createElement("div");

    element.id = "element";
    element.classList.add("element");
    element.style.backgroundColor = generateColor();
    element.ondragstart = function () {
        return false;
    };
    element.onpointerdown = onPointerDown;

    creator.appendChild(element);
}

let creator = document.getElementById("element-creator");
createElement();
