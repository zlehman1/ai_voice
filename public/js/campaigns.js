fetch("/panel/getcampaigns")
.then(res => res.json())
.then(data => {
    console.log(data)
    var campaignsCards = ''
    for(let y = 0; y < data.length; y++) {
        campaignsCards += `
        <div class="col-xxl-3 col-lg-4 col-md-6 mb-25">
        <!-- Profile Acoount -->
        <div class="card">
            <div class="card-body text-center pt-30 px-25 pb-0">

                <div class="account-profile-cards ">
                    <div class="ap-nameAddress">
                    <h6 class="ap-nameAddress__title">${data[y]["campaign_name"]}</h6>
                    <p class="ap-nameAddress__subTitle  fs-14 pt-1 m-0 ">${new Date(data[y]["createdAt"]).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div class="ap-button account-profile-cards__button button-group d-flex justify-content-center flex-wrap pt-20">
                    <button type="button" class="border text-capitalize px-25 color-gray transparent radius-md">
                        <img class="svg" src="/img/svg/mail.svg" alt="mail">View</button>
                    <button type="button" class="border text-capitalize px-25 color-gray transparent follow radius-md">
                        <span class="las la-user-plus follow-icon"></span>Edit</button>
                    </div>
                </div>

                <div class="card-footer mt-20 pt-20 pb-20 px-0 bg-transparent">

                    <div class="profile-overview d-flex justify-content-between flex-wrap">
                    <div class="po-details">
                        <h6 class="po-details__title">${data[y]["total_leads"]}</h6>
                        <span class="po-details__sTitle">Total Leads</span>
                    </div>
                    <div class="po-details">
                        <h6 class="po-details__title">${data[y]["total_calls"]}</h6>
                        <span class="po-details__sTitle">Total Calls</span>
                    </div>
                    <div class="po-details">
                    <h6 class="po-details__title">
                    ${data[y]["total_leads"] !== 0 ? ((data[y]["total_calls"] / data[y]["total_leads"]) * 100).toFixed(2) + '%' : '0%'}
                    </h6>
                        <span class="po-details__sTitle">Success Rate</span>
                    </div>
                    </div>

                </div>
            </div>
        </div>
        <!-- Profile Acoount End -->
        </div>
        `
    }
    document.querySelector(".cardsRow").innerHTML = campaignsCards
})