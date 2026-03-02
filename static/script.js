async function loadEvents() {
  const response = await fetch("/events");
  const data = await response.json();

  const list = document.getElementById("events-list");

  list.innerHTML = "";

  data.forEach((event) => {
    const item = document.createElement("li");

    const badge = document.createElement("span");
    badge.classList.add("badge");

    let text = "";
    const date = new Date(event.timestamp).toUTCString();

    if (event.action === "PUSH") {
      badge.classList.add("push");
      badge.textContent = "PUSH";
      text = `${event.author} pushed to ${event.to_branch} on ${date}`;
    } else if (event.action === "PULL_REQUEST") {
      badge.classList.add("pr");
      badge.textContent = "PR";
      text = `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${date}`;
    } else if (event.action === "MERGE") {
      badge.classList.add("merge");
      badge.textContent = "MERGE";
      text = `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${date}`;
    }

    const message = document.createElement("span");
    message.textContent = text;

    item.appendChild(badge);
    item.appendChild(document.createTextNode(" "));
    item.appendChild(message);

    list.appendChild(item);
  });
}

loadEvents();

setInterval(loadEvents, 15000);
