import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Settings, BarChart3, Package, Users, LogOut, Menu, X, Plus, Trash2, Edit, Eye, EyeOff, Save, FileText, TrendingUp, Camera, QrCode, Download, AlertCircle } from 'lucide-react';

// QR Kod oluşturma için basit QR implementasyonu
const generateQRCode = (text) => {
  // Basit QR kod text'i oluştur (gerçek SVG QR kod için external library gerekli)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
};

const PetShopMaster = () => {
  // ========== STATE MANAGEMENT ==========
  const [platform, setPlatform] = useState(null); // 'pc' veya 'mobile'
  const [userType, setUserType] = useState(null); // 'admin' veya 'cashier' (mobil için)
  const [user, setUser] = useState(null);
  const [currentModule, setCurrentModule] = useState('login');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loyalty, setLoyalty] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ========== VERI YÜKLEME ==========
  useEffect(() => {
    const savedData = localStorage.getItem('petShopData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setUsers(data.users || []);
      setProducts(data.products || []);
      setSuppliers(data.suppliers || []);
      setSales(data.sales || []);
      setExpenses(data.expenses || []);
      setAuditLog(data.auditLog || []);
      setLoyalty(data.loyalty || {});
    } else {
      initializeDefaultData();
    }
  }, []);

  useEffect(() => {
    if (users.length > 0 || products.length > 0) {
      const dataToSave = { users, products, suppliers, sales, expenses, auditLog, loyalty };
      localStorage.setItem('petShopData', JSON.stringify(dataToSave));
    }
  }, [users, products, suppliers, sales, expenses, auditLog, loyalty]);

  const initializeDefaultData = () => {
    const defaultUsers = [
      { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Yönetici' },
      { id: 2, username: 'kasa1', password: 'kasa123', role: 'cashier', name: 'Kasa Görevlisi 1' }
    ];
    const defaultProducts = [
      { id: 1, name: 'Köpek Maması 10kg', category: 'Mama', buyPrice: 150, sellPrice: 250, barcode: '1001', shop: 20, warehouse: 50, image: '🐕', expiryDate: '2025-12-31', tags: ['tahılsız', 'premium'] },
      { id: 2, name: 'Kedi Konservesi 400g', category: 'Mama', buyPrice: 20, sellPrice: 45, barcode: '1002', shop: 15, warehouse: 30, image: '🐈', expiryDate: '2025-11-15', tags: ['ıslak mama'] },
      { id: 3, name: 'Köpek Oyuncağı', category: 'Oyuncak', buyPrice: 30, sellPrice: 60, barcode: '1003', shop: 10, warehouse: 25, image: '🎾', expiryDate: '2026-12-31', tags: ['eğlence'] }
    ];
    const defaultSuppliers = [
      { id: 1, name: 'Premium Pet Co.', contact: '+90 555 1234567', email: 'info@premiumet.com', address: 'İstanbul', products: [1, 2] }
    ];
    
    setUsers(defaultUsers);
    setProducts(defaultProducts);
    setSuppliers(defaultSuppliers);
  };

  const addAuditLog = (action, details) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('tr-TR'),
      user: user?.name || 'Sistem',
      action,
      details
    };
    setAuditLog([newLog, ...auditLog]);
  };

  // ========== KAMERA BAŞLAT ==========
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert('Kamerasına erişim izni verilmedi!');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  // ========== CİHAZ SEÇİM MODÜLÜ ==========
  const PlatformSelectModule = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🐾</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pet Shop Master</h1>
          <p className="text-gray-600 mb-8">Evcil Hayvan Dükkânı Yönetim Sistemi v2.0</p>
          
          <p className="text-gray-700 font-semibold mb-6">Cihazınızı Seçin:</p>
          
          <div className="space-y-4">
            <button
              onClick={() => setPlatform('pc')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-2">💻</div>
              <p className="text-lg font-bold">Bilgisayar (PC)</p>
              <p className="text-sm opacity-90 mt-1">Tüm Özellikler + Yönetici</p>
            </button>

            <button
              onClick={() => setPlatform('mobile')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-2">📱</div>
              <p className="text-lg font-bold">Mobil Telefon</p>
              <p className="text-sm opacity-90 mt-1">Kasa + Admin Erişim</p>
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">✨ Yenilikler:</p>
            <p>📷 Kamera ile barkod tarama</p>
            <p>🔳 QR kod oluştur ve yazdır</p>
            <p>📱 Telefondan admin girişi</p>
          </div>
        </div>
      </div>
    );
  };

  // ========== MOBİL KULLANICI TİPİ SEÇİMİ ==========
  const MobileUserTypeSelect = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-6">📱</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hangi Şekilde Giriş Yapacaksınız?</h1>
          <p className="text-gray-600 mb-8">Telefonunuz için uygun modu seçin</p>
          
          <div className="space-y-4">
            <button
              onClick={() => setUserType('admin')}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-2">👨‍💼</div>
              <p className="text-lg font-bold">Yönetici</p>
              <p className="text-sm opacity-90 mt-1">Admin Paneli (Tüm İşlem)</p>
            </button>

            <button
              onClick={() => setUserType('cashier')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-2">👨‍💻</div>
              <p className="text-lg font-bold">Çalışan</p>
              <p className="text-sm opacity-90 mt-1">Sadece Kasa (Satış)</p>
            </button>
          </div>

          <button
            onClick={() => setPlatform(null)}
            className="w-full mt-6 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    );
  };

  // ========== GİRİŞ MODÜLÜ (İYİLEŞTİRİLMİŞ) ==========
  const LoginModule = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
      const foundUser = users.find(u => u.username === username && u.password === password);
      
      if (platform === 'mobile' && userType === 'cashier' && foundUser?.role !== 'cashier') {
        setError('Çalışan modu için kasa görevlisi hesabı kullanınız!');
        return;
      }

      if (foundUser) {
        setUser(foundUser);
        setCurrentModule('dashboard');
        addAuditLog('Giriş Yapıldı', `${foundUser.name} (${platform === 'pc' ? 'PC' : 'Mobil - ' + (userType === 'admin' ? 'Admin' : 'Çalışan')}) sistemine giriş yaptı`);
        setError('');
      } else {
        setError('Hatalı kullanıcı adı veya şifre!');
      }
    };

    const isMobile = platform === 'mobile';

    return (
      <div className={`min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4`}>
        <div className={`bg-white rounded-lg shadow-2xl ${isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'} w-full`}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🐾</div>
            <h1 className="text-3xl font-bold text-gray-800">Pet Shop Master</h1>
            <p className="text-gray-600 mt-2 text-sm">Evcil Hayvan Dükkânı Yönetim Sistemi</p>
            <div className="mt-3 space-y-1">
              <p className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full inline-block">
                {platform === 'pc' ? '💻 Bilgisayar Modu' : '📱 Mobil Modu'}
              </p>
              {platform === 'mobile' && (
                <p className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block ml-2">
                  {userType === 'admin' ? '👨‍💼 Admin' : '👨‍💻 Çalışan'}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-red-500 text-sm">❌ {error}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition text-sm"
            >
              Giriş Yap
            </button>
          </div>

          <div className="mt-6 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">Demo Hesapları:</p>
            <p>👤 Admin: admin / admin123</p>
            <p>💼 Kasa: kasa1 / kasa123</p>
          </div>

          <button
            onClick={() => {
              if (platform === 'mobile') {
                setUserType(null);
              } else {
                setPlatform(null);
              }
              setUsername('');
              setPassword('');
              setError('');
            }}
            className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition text-sm"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    );
  };

  // ========== QR KOD YAZDIRMA MODÜLÜ ==========
  const QRPrintModule = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [qrType, setQrType] = useState('product'); // 'product', 'catalog', 'receipt'

    const generateProductQR = (product) => {
      const qrData = {
        type: 'product',
        id: product.id,
        name: product.name,
        price: product.sellPrice,
        barcode: product.barcode
      };
      return generateQRCode(JSON.stringify(qrData));
    };

    const generateCatalogQR = () => {
      const catalogData = {
        type: 'catalog',
        products: products.map(p => ({ name: p.name, price: p.sellPrice, barcode: p.barcode }))
      };
      return generateQRCode(JSON.stringify(catalogData));
    };

    const printQRCodes = () => {
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
              .qr-item { border: 2px solid #000; padding: 15px; text-align: center; }
              .qr-item img { width: 150px; height: 150px; }
              .qr-label { font-weight: bold; margin-top: 10px; }
              h1 { text-align: center; }
              @media print { body { padding: 10px; } }
            </style>
          </head>
          <body>
            <h1>🐾 Pet Shop Master - QR Kod Etiketleri</h1>
            <div class="qr-grid">
              ${products.map(product => `
                <div class="qr-item">
                  <div class="qr-label">${product.name}</div>
                  <div class="qr-label">${product.sellPrice}₺</div>
                  <img src="${generateProductQR(product)}" alt="QR">
                  <div class="qr-label" style="font-size: 10px;">Kod: ${product.barcode}</div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    };

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🔳 QR Kod Yönetimi</h1>
          <button onClick={printQRCodes} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Download size={20} /> QR'ları Yazdır
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-purple-500 transition">
              <div className="text-center">
                <div className="text-4xl mb-2">{product.image}</div>
                <p className="font-bold text-sm mb-2">{product.name}</p>
                <p className="text-purple-600 font-bold mb-3">{product.sellPrice}₺</p>
                <img src={generateProductQR(product)} alt="QR" className="w-full mb-3" />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generateProductQR(product);
                    link.download = `qr-${product.barcode}.png`;
                    link.click();
                  }}
                  className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  📥 İndir
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📋 Katalog QR Kodu</h2>
          <div className="flex flex-col items-center">
            <img src={generateCatalogQR()} alt="Catalog QR" className="w-48 h-48 mb-4" />
            <p className="text-gray-600 mb-4 text-center">Müşteriler bu kodu tarayarak ürün kataloğuna erişebilirler</p>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = generateCatalogQR();
                link.download = 'catalog-qr.png';
                link.click();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              📥 Katalog QR'sını İndir
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ========== KASA MODÜLÜ (İYİLEŞTİRİLMİŞ - KAMERA TARAMA) ==========
  const PosModule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [manualBarcode, setManualBarcode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const barcodeRef = useRef(null);

    useEffect(() => {
      if (barcodeRef.current) barcodeRef.current.focus();
    }, []);

    const handleBarcodeInput = (barcode) => {
      const product = products.find(p => p.barcode === barcode);
      if (product && product.shop > 0) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          if (existingItem.quantity < product.shop) {
            setCart(cart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
          }
        } else {
          setCart([...cart, { ...product, quantity: 1, cartId: Date.now() }]);
        }
        addAuditLog('Ürün Tarandı', `${product.name} sepete eklendi (Barkod: ${barcode})`);
      } else if (product) {
        alert('⚠️ Ürün stokta yok!');
      } else {
        alert('❌ Barkod bulunamadı!');
      }
      setManualBarcode('');
      setSearchTerm('');
      barcodeRef.current?.focus();
    };

    const removeFromCart = (cartId) => {
      const item = cart.find(i => i.cartId === cartId);
      setCart(cart.filter(i => i.cartId !== cartId));
      addAuditLog('Ürün Kaldırıldı', `${item?.name} sepetten çıkarıldı`);
    };

    const updateQuantity = (cartId, quantity) => {
      if (quantity > 0) {
        setCart(cart.map(item =>
          item.cartId === cartId ? { ...item, quantity } : item
        ));
      }
    };

    const completeSale = () => {
      if (cart.length === 0) {
        alert('Sepet boş! Lütfen ürün ekleyin.');
        return;
      }

      const saleData = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('tr-TR'),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0),
        paymentMethod,
        cashier: user.name
      };

      let updatedProducts = products.map(product => {
        const cartItem = cart.find(c => c.id === product.id);
        if (cartItem) {
          return { ...product, shop: product.shop - cartItem.quantity };
        }
        return product;
      });
      setProducts(updatedProducts);

      setSales([saleData, ...sales]);
      addAuditLog('Satış Tamamlandı', `Toplam: ${saleData.total}₺, ${cart.length} ürün`);

      setCart([]);
      generateReceipt(saleData);
    };

    const generateReceipt = (saleData) => {
      const receiptWindow = window.open('', '', 'width=400,height=600');
      const qrData = {
        type: 'receipt',
        id: saleData.id,
        total: saleData.total,
        items: saleData.items.length,
        date: saleData.timestamp
      };
      
      receiptWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 20px; }
              .receipt { border: 1px solid #000; padding: 20px; }
                            h2 { margin: 0; }
              table { width: 100%; margin-top: 20px; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 5px; }
              .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
              .qr-section { margin-top: 20px; text-align: center; }
              .qr-section img { width: 120px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <h2>🐾 PET SHOP MASTER</h2>
              <p>${saleData.timestamp}</p>
              <table>
                <tr><th>Ürün</th><th>Adet</th><th>Fiyat</th><th>Toplam</th></tr>
                ${saleData.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.sellPrice}₺</td>
                    <td>${item.sellPrice * item.quantity}₺</td>
                  </tr>
                `).join('')}
              </table>
              <div class="total">Toplam: ${saleData.total}₺</div>
              <p>Ödeme: ${paymentMethod === 'cash' ? 'Nakit' : 'Kart'}</p>
              <div class="qr-section">
                <p style="font-size: 12px; margin-bottom: 10px;">Fiş QR Kodu:</p>
                <img src="${generateQRCode(JSON.stringify(qrData))}" alt="Receipt QR">
              </div>
              <p style="margin-top: 20px; font-size: 12px;">Bizi tercih ettiğiniz için teşekkürler!</p>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    };

    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(p => p.shop > 0);

    const cartTotal = cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
    const isMobile = platform === 'mobile';

    return (
      <div className={isMobile ? "pb-24" : "grid grid-cols-3 gap-4 h-screen overflow-hidden"}>
        {/* Ürün Listesi */}
        <div className={isMobile ? "p-4" : "col-span-2 overflow-y-auto p-4 bg-gray-50"}>
          {/* Kamera Tarama Bölümü */}
          <div className="mb-4 space-y-2">
            {!cameraActive ? (
              <>
                <input
                  ref={barcodeRef}
                  type="text"
                  placeholder="Barkod tarayıcıyı buraya odaklayın..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && manualBarcode) {
                      handleBarcodeInput(manualBarcode);
                    }
                  }}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                />
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 text-sm"
                >
                  <Camera size={18} /> Kamerayla Tara
                </button>
              </>
            ) : (
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <div className="bg-gray-800 p-2 text-center text-white text-xs">
                  <p>Barkodu kameraya göster</p>
                </div>
                <button
                  onClick={stopCamera}
                  className="w-full bg-red-600 text-white py-2 hover:bg-red-700 text-sm"
                >
                  ✕ Kamerayı Kapat
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Ürün adı ile arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          <div className={isMobile ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-3"}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => {
                  if (cart.some(item => item.id === product.id)) {
                    setCart(cart.map(item =>
                      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    ));
                  } else {
                    setCart([...cart, { ...product, quantity: 1, cartId: Date.now() }]);
                  }
                }}
                className={`p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-500 hover:shadow-md transition ${isMobile ? 'text-sm' : ''}`}
              >
                <div className={isMobile ? "text-2xl" : "text-3xl"}>
                  {product.image}
                </div>
                <p className="font-semibold text-xs sm:text-sm truncate">{product.name}</p>
                <p className="text-purple-600 font-bold text-sm">{product.sellPrice}₺</p>
                <p className="text-xs text-gray-500">Stok: {product.shop}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sepet */}
        <div className={`${isMobile ? "fixed bottom-0 left-0 right-0 bg-white border-t" : "bg-white border-l border-gray-300"} p-4 flex flex-col ${isMobile ? "max-h-96" : ""}`}>
          <h2 className={`font-bold mb-4 text-purple-600 ${isMobile ? "text-lg" : "text-xl"}`}>🛒 SEPET</h2>
          
          <div className={`flex-1 overflow-y-auto mb-4 space-y-2 ${isMobile ? "max-h-32" : ""}`}>
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-xs">Sepet boş</p>
            ) : (
              cart.map(item => (
                <div key={item.cartId} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                  <p className="font-semibold text-xs truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">-</button>
                      <span className="px-1 text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">+</button>
                    </div>
                    <span className="font-bold text-purple-600 text-xs">{item.sellPrice * item.quantity}₺</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="w-full text-xs bg-red-100 text-red-600 py-0.5 rounded mt-1 hover:bg-red-200"
                  >
                    Çıkar
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t-2 border-gray-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between font-bold text-purple-600">
              <span>TOPLAM:</span>
              <span>{cartTotal}₺</span>
            </div>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-2 py-1 border rounded text-xs"
            >
              <option value="cash">💵 Nakit</option>
              <option value="card">💳 Kart</option>
            </select>

            <button
              onClick={completeSale}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-bold hover:shadow-lg transition text-sm"
            >
              ✓ TAMAMLA
            </button>
            <button
              onClick={() => setCart([])}
              className="w-full bg-red-100 text-red-600 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition text-xs"
            >
              Boşalt
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ========== ENVANTER MODÜLÜ ==========
  const InventoryModule = () => {
    const [newProduct, setNewProduct] = useState({
      name: '', category: '', buyPrice: '', sellPrice: '', barcode: '', shop: 0, warehouse: 0, expiryDate: '', tags: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleAddProduct = () => {
      if (!newProduct.name || !newProduct.buyPrice || !newProduct.sellPrice) {
        alert('Lütfen zorunlu alanları doldurun!');
        return;
      }

      if (editingId) {
        setProducts(products.map(p =>
          p.id === editingId ? { ...p, ...newProduct, id: p.id } : p
        ));
        addAuditLog('Ürün Güncellendi', `${newProduct.name} bilgileri güncellendi`);
        setEditingId(null);
      } else {
        setProducts([...products, {
          id: Date.now(),
          ...newProduct,
          shop: parseInt(newProduct.shop) || 0,
          warehouse: parseInt(newProduct.warehouse) || 0,
          buyPrice: parseFloat(newProduct.buyPrice),
          sellPrice: parseFloat(newProduct.sellPrice),
          tags: newProduct.tags.split(',').map(t => t.trim()).filter(t => t),
          image: '📦'
        }]);
        addAuditLog('Ürün Eklendi', `${newProduct.name} sisteme eklendi`);
      }

      setNewProduct({ name: '', category: '', buyPrice: '', sellPrice: '', barcode: '', shop: 0, warehouse: 0, expiryDate: '', tags: '' });
      setShowForm(false);
    };

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📦 Ürün Envanteri</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setNewProduct({ name: '', category: '', buyPrice: '', sellPrice: '', barcode: '', shop: 0, warehouse: 0, expiryDate: '', tags: '' });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={20} /> Yeni Ürün Ekle
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-purple-600">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Ürün Adı*" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Kategori" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Alış Fiyatı*" type="number" value={newProduct.buyPrice} onChange={(e) => setNewProduct({...newProduct, buyPrice: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Satış Fiyatı*" type="number" value={newProduct.sellPrice} onChange={(e) => setNewProduct({...newProduct, sellPrice: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Barkod" value={newProduct.barcode} onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Dükkanda Stok" type="number" value={newProduct.shop} onChange={(e) => setNewProduct({...newProduct, shop: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Depoda Stok" type="number" value={newProduct.warehouse} onChange={(e) => setNewProduct({...newProduct, warehouse: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Son Kullanma Tarihi" type="date" value={newProduct.expiryDate} onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Etiketler (virgülle ayırın)" value={newProduct.tags} onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddProduct} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                <Save size={18} /> {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                İptal
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Ürün Adı</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-center">Barkod</th>
                <th className="px-4 py-3 text-center">Satış Fiyatı</th>
                <th className="px-4 py-3 text-center">Dükkan</th>
                <th className="px-4 py-3 text-center">Depo</th>
                <th className="px-4 py-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-center text-xs font-mono">{product.barcode}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-600">{product.sellPrice}₺</td>
                  <td className="px-4 py-3 text-center"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{product.shop}</span></td>
                  <td className="px-4 py-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{product.warehouse}</span></td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button onClick={() => {
                      setEditingId(product.id);
                      setNewProduct(product);
                      setShowForm(true);
                    }} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">✏️</button>
                    <button onClick={() => {
                      setProducts(products.filter(p => p.id !== product.id));
                      addAuditLog('Ürün Silindi', `${product.name} sistemden silindi`);
                    }} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ========== DASHBOARD ==========
  const DashboardModule = () => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const todaySales = sales.filter(s => s.timestamp.includes(new Date().toLocaleDateString('tr-TR'))).length;
    const lowStockCount = products.filter(p => p.shop < 5).length;
    const isMobile = platform === 'mobile';

    if (isMobile) {
      return (
        <div className="min-h-screen bg-gray-100 pb-24">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">🐾 Pet Shop</h1>
                <p className="text-sm opacity-90">{user.name}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm">Toplam Satış</p>
              <p className="text-2xl font-bold text-green-600">{totalSales}₺</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm">Bugünkü Satış</p>
              <p className="text-2xl font-bold text-blue-600">{todaySales}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-600">
              <p className="text-gray-600 text-sm">Düşük Stok</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
            </div>
          </div>

          <div className="p-4">
            <h2 className="font-bold text-lg mb-3">📝 Son Satışlar</h2>
            <div className="space-y-2">
              {sales.slice(0, 5).map(sale => (
                <div key={sale.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <p className="font-semibold">{sale.items.length} ürün</p>
                      <p className="text-gray-600 text-xs">{sale.timestamp}</p>
                    </div>
                    <p className="font-bold text-green-600">{sale.total}₺</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🏠 Kontrol Paneli</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
            <p className="text-sm opacity-90">Toplam Satış</p>
            <p className="text-3xl font-bold">{totalSales}₺</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
            <p className="text-sm opacity-90">Toplam Gider</p>
            <p className="text-3xl font-bold">{totalExpenses}₺</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
            <p className="text-sm opacity-90">Bugünkü Satış</p>
            <p className="text-3xl font-bold">{todaySales}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md">
            <p className="text-sm opacity-90">Düşük Stok Ürünü</p>
            <p className="text-3xl font-bold">{lowStockCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📝 Son Satışlar</h2>
            {sales.slice(0, 5).map((sale, idx) => (
              <div key={sale.id} className="border-b pb-3 mb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{sale.items.length} ürün</p>
                    <p className="text-xs text-gray-600">{sale.timestamp}</p>
                  </div>
                  <p className="font-bold text-green-600">{sale.total}₺</p>
                </div>
              </div>
            ))}
            {sales.length === 0 && <p className="text-gray-400 text-center py-4">Henüz satış yok</p>}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">⚠️ Sistem Uyarıları</h2>
            {lowStockCount > 0 && (
              <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-3">
                <p className="text-sm font-semibold text-red-800">Düşük Stok Uyarısı</p>
                <p className="text-xs text-red-700">{lowStockCount} ürünün stoku 5'in altında</p>
              </div>
            )}
            {sales.length === 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3">
                <p className="text-sm font-semibold text-blue-800">Hoş Geldiniz!</p>
                <p className="text-xs text-blue-700">Sisteme ilk satış veya giderinizi girebilirsiniz</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========== ANA RENDER ==========
  if (!platform) return <PlatformSelectModule />;
  if (platform === 'mobile' && !userType) return <MobileUserTypeSelect />;
  if (!user) return <LoginModule />;

  const isMobile = platform === 'mobile';

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard': return <DashboardModule />;
      case 'pos': return <PosModule />;
      case 'inventory': return !isMobile ? <InventoryModule /> : null;
      case 'qr': return !isMobile ? <QRPrintModule /> : null;
      default: return <DashboardModule />;
    }
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 overflow-auto">
          {currentModule === 'pos' ? <PosModule /> : <DashboardModule />}
        </div>

        {/* Mobil Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around shadow-lg">
          <button
            onClick={() => setCurrentModule('dashboard')}
            className={`flex-1 py-3 text-center transition ${currentModule === 'dashboard' ? 'text-purple-600 bg-purple-50 border-t-2 border-purple-600' : 'text-gray-600'}`}
          >
            <div className="text-xl">🏠</div>
            <div className="text-xs">Panel</div>
          </button>
          <button
            onClick={() => setCurrentModule('pos')}
            className={`flex-1 py-3 text-center transition ${currentModule === 'pos' ? 'text-purple-600 bg-purple-50 border-t-2 border-purple-600' : 'text-gray-600'}`}
          >
            <div className="text-xl">💰</div>
            <div className="text-xs">Kasa</div>
          </button>
          <button
            onClick={() => {
              addAuditLog('Çıkış Yapıldı', `${user.name} (Mobil) sistemden çıktı`);
              setUser(null);
              setUserType(null);
              setPlatform(null);
            }}
            className="flex-1 py-3 text-center text-red-600"
          >
            <div className="text-xl">🚪</div>
            <div className="text-xs">Çıkış</div>
          </button>
        </div>
      </div>
    );
  }

  // PC Modu
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-purple-700 flex items-center justify-between">
          {sidebarOpen && <span className="text-xl font-bold">🐾 Pet Shop</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-purple-700 p-2 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: '🏠', label: 'Kontrol Paneli' },
            { id: 'pos', icon: '💰', label: 'Kasa Modülü' },
            { id: 'inventory', icon: '📦', label: 'Envanter' },
            { id: 'qr', icon: '🔳', label: 'QR Kod Yönetimi' }
          ].map(menu => (
            <button
              key={menu.id}
              onClick={() => setCurrentModule(menu.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentModule === menu.id
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'hover:bg-purple-700'
              }`}
            >
              <span className="text-lg">{menu.icon}</span>
              {sidebarOpen && <span>{menu.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-700">
          {sidebarOpen && (
            <div className="mb-4">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs opacity-75">{user.role === 'admin' ? 'Yönetici' : 'Kasa Görevlisi'}</p>
              <p className="text-xs opacity-50 mt-1">💻 PC Modu</p>
            </div>
          )}
          <button
            onClick={() => {
              addAuditLog('Çıkış Yapıldı', `${user.name} (PC) sistemden çıktı`);
              setUser(null);
              setPlatform(null);
            }}
            className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderModule()}
      </div>
    </div>
  );
};

export default PetShopMaster;
    
