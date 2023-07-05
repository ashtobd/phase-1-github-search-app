document.addEventListener('DOMContentLoaded', begin)

function begin() {
    const form = document.getElementById('github-form')
    form.addEventListener('submit', searchUser)

    function searchUser(event) {
        event.preventDefault()
        const user = this.search.value

        fetch(`https://api.github.com/search/users?q=${user}`,{
            method:"GET",
            headers: { 'Accept': 'application / vnd.github.v3 + json' }
        })
            .then(response => response.json())
            .then(data => processData(data))
            .catch(err => console.error(err));
    }

    function processData(data) {
        const users = data.items
        const usersList = document.getElementById('user-list')
        users.forEach(user => {
            const newLi = document.createElement('li')
            newLi.className = 'card'
            newLi.id = user.login
            newLi.textContent = user.login

            const newImg = document.createElement('img')
            newImg.className = 'avatar'
            newImg.src = user.avatar_url
            newLi.append(newImg)

            const profileLink = document.createElement('a')
            profileLink.textContent = 'Github Profile'
            profileLink.href = user.html_url
            newLi.append(profileLink)

            const newButton = document.createElement('button')
            newButton.className = 'repo-button'
            newButton.id = user.login
            newButton.textContent = 'Repos'
            newLi.append(newButton)

            usersList.append(newLi)
        })

        setTimeout(() => {
            const repoButtons = document.querySelectorAll('.repo-button')
            repoButtons.forEach(button => button.addEventListener('click', provideRepos))
        }, 2000);

        function provideRepos() {
            fetch(`https://api.github.com/users/${this.id}/repos`, {
                method: "GET",
                headers: { 'Accept': 'application / vnd.github.v3 + json' }
            })
                .then(response => response.json())
                .then(data => listRepos(data))
        }

        function listRepos(data) {
            const repoList = document.getElementById('repos-list')
            if (repoList.getElementsByTagName('li').length > 0) {
                while (repoList.firstChild) {
                    repoList.removeChild(repoList.lastChild)
                }
            }
            data.forEach(repo => {
                const newLi = document.createElement('li')
                newLi.className = 'repo'
                newLi.id = repo.owner.login

                const newLink = document.createElement('a')
                newLink.textContent = repo.full_name
                newLink.href = repo.html_url
                newLi.append(newLink)

                repoList.append(newLi)
            })
        }
    }
}