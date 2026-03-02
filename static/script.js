async function loadEvents() {
  const response = await fetch("/events");
  const data = await response.json();

  const list = document.getElementById("events-list");

  list.innerHTML = "";

  data.forEach((event) => {
    const item = document.createElement("li");

    /* event header */
    const header = document.createElement("div");
    header.classList.add("event-header");

    const badge = document.createElement("span");
    badge.classList.add("badge");

    const message = document.createElement("span");

    const date = new Date(event.timestamp).toUTCString();

    /* PUSH EVENT */

    if (event.action === "PUSH") {
      badge.classList.add("push");
      badge.textContent = "PUSH";

      message.textContent = `${event.author} pushed to ${event.to_branch} on ${date}`;

      header.appendChild(badge);
      header.appendChild(message);

      item.appendChild(header);

      /* show files pushed */

      if (event.files && event.files.length > 0) {
        const filesContainer = document.createElement("div");
        filesContainer.classList.add("files");

        event.files.forEach((file) => {
          const fileItem = document.createElement("div");
          fileItem.classList.add("file-item");
          fileItem.textContent = "• " + file;

          filesContainer.appendChild(fileItem);
        });

        item.appendChild(filesContainer);
      }
    } else if (event.action === "PULL_REQUEST") {

    /* PULL REQUEST EVENT */
      badge.classList.add("pr");
      badge.textContent = "PR";

      message.textContent = `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${date}`;

      header.appendChild(badge);
      header.appendChild(message);

      item.appendChild(header);
    } else if (event.action === "MERGE") {

    /* MERGE EVENT */
      badge.classList.add("merge");
      badge.textContent = "MERGE";

      message.textContent = `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${date}`;

      header.appendChild(badge);
      header.appendChild(message);

      item.appendChild(header);
    }

    list.appendChild(item);
  });
}

loadEvents();

/* refresh every 15 seconds */

setInterval(loadEvents, 15000);
