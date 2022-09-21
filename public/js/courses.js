
const courses = document.getElementsByClassName("course");

window.addEventListener("load", () => {

    for (const course of Array.from(courses)) {

        course.addEventListener("click", () => {
            let courseId = course.getAttribute("data-id");
            console.log(courseId);

            fetch(`/api/courses/${courseId}/join`, { method: "GET" })
                .then(result => result.json())
                .then((result) => {
                    let data = result.data;
                    if (data && data.success) {
                        course.textContent = "Joined"
                    } else {
                        course.textContent = "Try again"
                    }
                    console.log(result);
                })
        })
    }
})
