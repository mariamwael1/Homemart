const translations = {
    en: {
        marketplace: "Marketplace",
        myOrders: "My Orders",
        basket: "Basket",
        login: "Login",
        logout: "Logout",
        contactUs: "Contact Us",
        adminDashboard: "Admin Dashboard",
        yourBasket: "Your Basket",
        proceedToCheckout: "Proceed to Checkout",
        clearBasket: "Clear Basket",
        searchPlaceholder: "Search for shops, categories, or products",
        homeMarket: "Home Market",
        termsPolicies: "Terms and Policies",
        orderNow: "Order Now",
        chooseLocation: "Choose your location",
        changeLocation: "Change Location",
        yourOrders: "My Orders",
        locationPlaceholder: "Enter your address here...",
        saveAddress: "Save Address",
        paymentDetails: "Payment Details",
        selectPaymentMethod: "Select Payment Method",
        confirmPayment: "Confirm Payment",
        cancel: "Cancel",
        deliveryAddress: "Delivery Address",
        fullName: "Full Name",
        emailAddress: "Email Address",
        yourMessage: "Your Message",
        sendMessage: "Send Message",
        loginAccount: "Login to Your Account",
        username: "Username",
        password: "Password"
    },
    ar: {
        marketplace: "السوق",
        myOrders: "طلباتي",
        basket: "السلة",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
        contactUs: "اتصل بنا",
        adminDashboard: "لوحة الإدارة",
        yourBasket: "سلتك",
        proceedToCheckout: "إتمام الشراء",
        clearBasket: "تفريغ السلة",
        searchPlaceholder: "ابحث عن المتاجر أو الفئات أو المنتجات",
        homeMarket: "هوم ماركت",
        termsPolicies: "الشروط والسياسات",
        orderNow: "اطلب الآن",
        chooseLocation: "اختر موقعك",
        changeLocation: "تغيير الموقع",
        yourOrders: "طلباتي",
        locationPlaceholder: "أدخل عنوانك هنا...",
        saveAddress: "حفظ العنوان",
        paymentDetails: "تفاصيل الدفع",
        selectPaymentMethod: "اختر طريقة الدفع",
        confirmPayment: "تأكيد الدفع",
        cancel: "إلغاء",
        deliveryAddress: "عنوان التوصيل",
        fullName: "الاسم الكامل",
        emailAddress: "البريد الإلكتروني",
        yourMessage: "رسالتك",
        sendMessage: "إرسال الرسالة",
        loginAccount: "تسجيل الدخول إلى حسابك",
        username: "اسم المستخدم",
        password: "كلمة المرور"
    }
};

function changeLanguage() {
    const selectedLang = document.getElementById("language-selector").value;
    const t = translations[selectedLang];

    if (!t) return;

    // Update navigation
    document.querySelectorAll('nav a')[0].textContent = t.marketplace;
    document.querySelectorAll('nav a')[1].textContent = t.myOrders;
    document.querySelectorAll('nav a')[2].textContent = t.basket;
    document.querySelectorAll('nav a')[3].textContent = t.login;
    if (document.querySelectorAll('nav a')[4]) {
        document.querySelectorAll('nav a')[4].textContent = t.contactUs;
    }

    // Update other static texts
    if (document.getElementById('page-title')) document.getElementById('page-title').textContent = t.homeMarket;
    if (document.getElementById('search-bar')) document.getElementById('search-bar').placeholder = t.searchPlaceholder;
    if (document.getElementById('location')) document.getElementById('location').textContent = t.chooseLocation;
    if (document.getElementById('address-input')) document.getElementById('address-input').placeholder = t.locationPlaceholder;
    if (document.getElementById('checkout-btn')) document.getElementById('checkout-btn').textContent = t.proceedToCheckout;
    if (document.getElementById('clear-basket-btn')) document.getElementById('clear-basket-btn').textContent = t.clearBasket;
    if (document.getElementById('payment-modal')) document.querySelector('.modal-content h2').textContent = t.paymentDetails;
    if (document.getElementById('delivery-address')) document.getElementById('delivery-address').placeholder = t.deliveryAddress;
}
