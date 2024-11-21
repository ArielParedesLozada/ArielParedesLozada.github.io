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
                        <span id="skills-${dato.name}">Skills:
                    ${fetch('https://api.github.com/repos/ArielParedesLozada/' + dato.name + '/languages')
                    .then(res => {
                        if (!res.ok) {
                            throw new Error("Error al obtener los lenguajes")
                        }
                        return res.json()
                    })
                    .then(dats => {
                        let skillsPlaceholder = document.getElementById('skills-' + dato.name)
                        let outS = ""
                        Object.keys(dats).forEach(lang => {
                            let langLow = lang.toLowerCase()
                            switch (langLow) {
                                case 'html':
                                    langLow = 'html5'
                                    break;
                                case 'css':
                                    langLow = 'css3'
                                    break
                                default:
                                    break;
                            }
                            outS += `
                                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${langLow}/${langLow}-plain.svg"
                                        height="20" width="20" alt="" srcset="">
                                    `
                        })
                        skillsPlaceholder.innerHTML = outS
                    })
                }
                        </span>
    
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