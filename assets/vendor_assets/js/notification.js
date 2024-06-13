const toastButtons = document.querySelectorAll('.btn-toast');
  let toastCount = 0;
  function createToast(type,icon,close,header,content){
    console.log(close)
    let toast = ``;
    let toastHeader = ``;
    let toastContent = ``;
    if(header) {
        toastHeader = header
    }
    if(content) {
        toastContent = content
    }
    console.log(icon)
    const notificationShocase = $('.notification-wrapper');
    if(type == "default"){
        toast = `
        <div class="dm-notification-box notification-${type} notification-${toastCount}">
          <div class="dm-notification-box__content">
          <a href="#" class="dm-notification-box__close" data-toast="close">
              <i class="uil uil-times"></i>
          </a>
              <div class="dm-notification-box__text">
                  <h6>Notification Title</h6>
                  <p>
                      This is the content of the notification. This is the content of the notification. This is the content of the notification.
                  </p>
              </div>
          </div>
        </div>
        `;
      }else if(type !== "default"){
        toast = `
        <div class="dm-notification-box notification-${type} notification-${toastCount}">
          <div class="dm-notification-box__content media">
              <div class="dm-notification-box__icon">
                  <i class="uil uil-${icon}"></i>
              </div>
              <div class="dm-notification-box__text media-body">
                  <h6>Notification Title</h6>
                  <p>
                      This is the content of the notification. This is the content of the notification. This is the content of the notification.
                  </p>
              </div>
              <a href="#" class="dm-notification-box__close" data-toast="close">
                  <i class="uil uil-times"></i>
              </a>
          </div>
      </div>
      `;
      }
  
    if(close){
        toast =`
        <div class="dm-notification-box notification-${type} notification-${toastCount}">
            <div class="dm-notification-box__content media">
            <div class="dm-notification-box__icon">
                <i class="uil uil-${icon}"></i>
            </div>
                <div class="dm-notification-box__text">
                    <h6>${toastHeader}</h6>
                    <p>
                        ${toastContent}
                    </p>
                </div>
            </div>
            <a class="dm-notification-box__close" data-toast="close" style="cursor: pointer;">
                <i class="uil uil-times"></i>
            </a>
        </div>
        `
    }
    
    notificationShocase.append(toast);
    toastCount++;
  }
  function showNotification(e){
    e.preventDefault();
    
    let duration = (optionValue, defaultValue) =>
      typeof optionValue === "undefined" ? defaultValue : optionValue;

    dureation = this.dataset.toastduration;
    
    let toastType = this.dataset.toasttype;
    let toastIcon = this.dataset.toasticon;
    let customClose = this.dataset.customclose;
    let customHeader = this.dataset.customheader;
    let customContent = this.dataset.customcontent;

    console.log(customContent)
    createToast(toastType,toastIcon,customClose,customHeader,customContent);
    let thisToast = toastCount - 1;

    $('*[data-toast]').on('click',function(){
        $(this).parent('.dm-notification-box').remove();
    })

    setTimeout(function(){
      $(document).find(".notification-"+thisToast).remove();
    },duration(this.dataset.duration,3000));

  }

  function showNotificationFunction(toasttype, toasticon, customclose, customheader, customcontent){
    let duration = (optionValue, defaultValue) =>
      typeof optionValue === "undefined" ? defaultValue : optionValue;
    
    let toastType = toasttype;
    let toastIcon = toasticon;
    let customClose = customclose;
    let customHeader = customheader;
    let customContent = customcontent;

    console.log(customContent)
    createToast(toastType,toastIcon,customClose,customHeader,customContent);
    let thisToast = toastCount - 1;

    $('*[data-toast]').on('click',function(){
        $(this).parent('.dm-notification-box').remove();
    })

    setTimeout(function(){
      $(document).find(".notification-"+thisToast).remove();
    },3000);

  }

  toastButtons.forEach(toastButton => toastButton.addEventListener('click',showNotification));

//   Notification Placements

const placementSelect = document.getElementById('noti-placement')
const notificationWrapper = document.querySelector('.notification-wrapper');
if(placementSelect){
    placementSelect.onchange = function(){
        let selectElement = (typeof this.selectedIndex === "undefined" ? window.event.srcElement : this);
        var selectValue = selectElement.value || selectElement.options[selectElement.selectedIndex].value;
        switch (selectValue) {
            case "tl":  
                notificationWrapper.classList.add('top-left');
                notificationWrapper.classList.remove('top-right');
                notificationWrapper.classList.remove('bottom-left');
                notificationWrapper.classList.remove('bottom-right');
                break;
            
            case "tr": 
                notificationWrapper.classList.add('top-right');
                notificationWrapper.classList.remove('top-left');
                notificationWrapper.classList.remove('bottom-left');
                notificationWrapper.classList.remove('bottom-right');
                break;
            
            case "bl": 
                notificationWrapper.classList.add('bottom-left');
                notificationWrapper.classList.remove('bottom-right');
                notificationWrapper.classList.remove('top-right');
                notificationWrapper.classList.remove('top-left');
                break;
    
            case "br": 
                notificationWrapper.classList.add('bottom-right');
                notificationWrapper.classList.remove('bottom-left');
                notificationWrapper.classList.remove('top-right');
                notificationWrapper.classList.remove('top-left');
                break;
            
            default: break;
        }
    }
}
