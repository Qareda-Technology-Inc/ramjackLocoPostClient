// import Toastify from "toastify-js";
// import { NotificationElement, NotificationProps } from "./index";

// const init = (el: NotificationElement, props: NotificationProps) => {
//   el.toastify = Toastify({
//     node: el,
//     duration: 3000,
//     newWindow: true,
//     close: false,
//     gravity: "top",
//     position: "right",
//     stopOnFocus: true,
//     ...props.options,
//     className: `${props.options.className || ""}`,
//     style: {
//       background: "none",
//       padding: "0",
//       boxShadow: "none",
//       ...props.options.style,
//     },
//   });

//   el.showToast = () => {
//     el.toastify.showToast();
//   };

//   el.hideToast = () => {
//     if (el.toastify) {
//       el.toastify.hideToast();
//     }
//   };
// };

// const reInit = (el: NotificationElement) => {
//   if (el && el.toastify) {
//     try {
//       el.hideToast();
//     } catch (error) {
//       console.debug('Toast already hidden or not initialized');
//     }
//   }
// };

// export { init, reInit };
