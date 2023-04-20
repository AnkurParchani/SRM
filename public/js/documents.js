/* eslint-disable */
import axios from "axios";
import { showDocumentsModal } from "./modal";
import { showAlert } from "./alerts";

export const showDocuments = async entryId => {
  try {
    const res = await axios(`/api/v1/ledgerEntries/${entryId}`);
    if (res.data.status === "success" && res.data.doc.photo.length > 0) {
      const photos = res.data.doc.photo;
      for (const photo of photos) {
        const img = new Image();

        const loaded = new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        img.src = `/img/documents/${photo}`;
        await loaded;

        const html = `<img src=${img.src} class="img-fluid docImage" alt="Image not found"/>`;

        document
          .querySelector(".owl-carousel")
          .insertAdjacentHTML("beforeend", html);
      }

      $(document).ready(function() {
        $(".owl-carousel").owlCarousel({
          nav: true,
          responsive: {
            0: {
              items: 1
            },
            700: {
              items: 2
            },
            1100: {
              items: 3
            }
          }
        });
      });

      showDocumentsModal();
    } else {
      showAlert("error", "No documents found with this entry", 2);
    }
  } catch (err) {
    console.log("Axios show Documents error", err);
  }
};

export const addDocuments = async (images, entryId) => {
  const customerId = window.location.pathname.split("/")[2];

  const imageForm = new FormData();
  for (let i = 0; i < images.length; i++) {
    imageForm.append("documents", images[i]);
  }
  imageForm.append("customer", customerId);

  const res = await axios({
    method: "POST",
    data: imageForm,
    url: `/api/v1/ledgerEntries/${entryId}/addDocs`
  });

  if (res.data.status === "success") {
    showAlert("success", "Document added Successfully", 1.5);
    setTimeout(() => {
      location.reload();
    }, 1500);
  }
};
