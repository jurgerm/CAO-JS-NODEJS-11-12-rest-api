const restApiUrl = 'http://localhost:8080/rest-api';

function getMembershipList() {
  return fetch(
    `${restApiUrl}/memberships`
  )
    .then((res) => res.json())
    .then((data) => { return data });
};

function getUsersList() {
  return fetch(
    `${restApiUrl}/users`
  )
    .then((res) => res.json())
    .then((data) => { return data });
};

function deleteMembership(membershipId) {
  return fetch(
    `${restApiUrl}/memberships/${membershipId}`,
    {
      method: 'DELETE'
    }
  )
    .then((res) => res.json());
}

function deleteUser(userId) {
  return fetch(
    `${restApiUrl}/users/${userId}`,
    {
      method: 'DELETE'
    }
  )
    .then((res) => res.json());
}

function displayMembershipList() {
  getMembershipList().then((data) => {
    const membershipListContainer = document.getElementById("membershipListContainer");

    membershipListContainer.innerHTML = '';

    data.forEach(membership => {
      console.log(membership);
      const box = document.createElement("div");
      box.classList.add("box");

      const boxHeader = document.createElement("div");
      boxHeader.classList.add("box-header");
      boxHeader.innerHTML =
        parseFloat(membership.price).toFixed(2)
        + '€ '
        + membership.name;
      box.append(boxHeader);

      const boxContent = document.createElement("div");
      boxContent.classList.add("box-content");
      boxContent.innerHTML = membership.description;
      box.append(boxContent);

      const boxFooter = document.createElement("div");
      boxFooter.classList.add("box-header");
      const boxFooterButton = document.createElement("button");
      const trashIcon = document.createElement("i");
      trashIcon.classList.add('fa', 'fa-trash');
      boxFooterButton.append(trashIcon);
      boxFooterButton.addEventListener("click", (e) => {
        deleteMembership(membership._id)
          .then((json) => {
            alert(`Membership ${membership.name} was deleted.`);
            displayMembershipList();
          })
          .catch(error => error);
      });
      boxFooter.append(boxFooterButton);
      box.append(boxFooter);

      membershipListContainer.append(box);
    });
  });
};

function displayUsersList() {
  getUsersList().then((data) => {
    const usersListContainer = document.getElementById("usersListContainer");

    usersListContainer.innerHTML = '';

    data.forEach(user => {
      console.log(user);
      const box = document.createElement("div");
      box.classList.add("box", "user");

      const boxHeader = document.createElement("div");
      boxHeader.classList.add("box-header");
      boxHeader.innerHTML = user.name + ' ' + user.surname;
      box.append(boxHeader);

      const boxContent = document.createElement("div");
      boxContent.classList.add("box-content");
      let p = document.createElement("p");
      p.innerHTML = "Email Address: " + user.email;
      boxContent.append(p);
      
      p = document.createElement("p");
      p.innerHTML = "Membership ID: " + user.membership_id;
      boxContent.append(p);

      p = document.createElement("p");
      p.innerHTML = "Membership name: " + user.membership?.name;
      boxContent.append(p);
      box.append(boxContent);

      const boxFooter = document.createElement("div");
      boxFooter.classList.add("box-header");
      const boxFooterButton = document.createElement("button");
      const trashIcon = document.createElement("i");
      trashIcon.classList.add('fa', 'fa-trash');
      boxFooterButton.append(trashIcon);
      boxFooterButton.addEventListener("click", (e) => {
        deleteUser(user._id)
          .then((json) => {
            alert(`User ${membership.name} was deleted.`);
            displayUsersList();
          })
          .catch(error => error);
      });
      boxFooter.append(boxFooterButton);
      box.append(boxFooter);

      usersListContainer.append(box);
    });
  });
};

function createNewMembership(membership) {
  return fetch(
    `${restApiUrl}/memberships`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(membership)
  })
    .then(response => response.json())
    .then((data) => { return data });
}


function createNewUser(user) {
  return fetch(
    `${restApiUrl}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then((data) => { return data });
}

function onSubmitNewMembership(e) {
  e.preventDefault();
  const membership = {
    "name": e.target.elements.name.value.trim(),
    "price": Number(e.target.elements.price.value),
    "description": e.target.elements.description.value
  };
  createNewMembership(membership)
    .then((data) => {
      alert(`Membership was added.`);
      window.location = '/memberships.html';
    })
    .catch(error => error);
  return false;
}

function onSubmitNewUser(e) {
  e.preventDefault();
  const user = {
    "name": e.target.elements.name.value.trim(),
    "surname": e.target.elements.surname.value.trim(),
    "email": e.target.elements.email.value,
    "membership_id": e.target.elements.membership_id.value
  };

  createNewUser(user)
    .then((data) => {
      alert(`User was added.`);
      window.location = '/users.html';
    })
    .catch(error => error);
  return false;
}

function initNewMembershipPage() {
  document.getElementById("newMembershipformId")
    .addEventListener("submit", onSubmitNewMembership);
}

function initNewUserPage() {
  // padarome, kad submitinant formą, būtų iškviečiama funkcija  onSubmitNewUser
  document.getElementById("newUserFormId")
    .addEventListener("submit", onSubmitNewUser);

  // užpildome membership selectą

  getMembershipList().then((data) => {
    const membership_id = document.getElementById("membership_id");
    membership_id.innerHTML = '';
    data.forEach(membership => {
      const option = document.createElement("option");
      option.value = membership._id;
      option.innerText = `${membership.name} (${parseFloat(membership.price).toFixed(2)}€)`;
      membership_id.append(option);
    });
  });
}
