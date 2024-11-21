fetch('https://api.github.com/users/ArielParedesLozada/repos')
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos")
        }
        return response.json()
    })
    .then(data => {
        let placeholder = document.getElementById('projects-placeholder')
        let out = ""
        for (const dato of data) {
            if (dato.description === null) {
                continue
            }
            out += `
                    <div class="card project-card">
                    <section class="card-body d-flex-col">
                        <h3 class="card-title d-flex" style="justify-content: space-between;">
                        ${dato.name}    
                        </h3>
                        <!--
                        <span>Skills:
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg"
                                height="20" width="20" alt="" srcset="">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-plain.svg" height="20"
                                width="20" alt="" srcset="">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                                height="20" width="20" alt="" srcset="">
                        </span>
                        -->
    
                        <p class="card-desc">${dato.description}</p>
                        <div class="card-footer d-flex space-between">
                            <span class="card-tag">open-source</span>
                            <a class="project-link d-flex" href="${dato.html_url}"
                                target="_blank">Source
                                <span class="iconify" data-icon="uil:external-link-alt" data-width="24"
                                    data-height="24"></span></a>
                        </div>
                    </section>
                </div>
        `
        }
        placeholder.innerHTML = out
    })
    .catch(error => console.log(error))