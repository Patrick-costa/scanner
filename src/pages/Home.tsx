import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useEffect, useState } from 'react';
import { qrCodeOutline, barcodeOutline, copyOutline, copy, text } from 'ionicons/icons'
import {Clipboard} from '@ionic-native/clipboard'

const Home: React.FC = () => {

  const [err, setErr] = useState<string>();
  const [hideBg, setHideBg] = useState("");
  const [presentAlert] = useIonAlert();
  const [box, setBox] = useState("");
  const [result, setResult] = useState("");

  const startScanQr = async () => {
    BarcodeScanner.hideBackground();

    setHideBg("hideBg");
    setBox("scan-box-qrcode")

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      stopScan();
      setResult(result.content!);
    }
  };

  const startScanBc = async () => {
    BarcodeScanner.hideBackground();

    setResult("");
    setHideBg("hideBg");
    setBox("scan-box-barcode")

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      stopScan();
      setResult(result.content!);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          return true
        }

        return false;
      } catch (error: any) {
        setErr(error.message);
      }
    }
    checkPermission()
  }, [])

  const stopScan = () => {
    BarcodeScanner.showBackground()
    BarcodeScanner.stopScan();
    setHideBg("")
  }

  const copyText = () => {
    Clipboard.copy(result).then(() => {
      presentAlert('Copiado!', [{text: 'OK', role: 'Cancel'}])
    })
  }

  if (err) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle slot="start">Scanner</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonRow>
            <IonText color="danger">{err}</IonText>
          </IonRow>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            QRScanner
          </IonTitle>
          <IonButtons slot="end">
            <IonButton hidden={!hideBg} onClick={stopScan}>
              Stop Scan
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={hideBg}>
        <div className='start-button'>
          <IonButton hidden={!!hideBg}
            onClick={startScanQr}
          ><IonIcon icon={qrCodeOutline}
            slot="start" />Scan QRCode</IonButton>
          <IonButton hidden={!!hideBg}
            onClick={startScanBc}
          ><IonIcon icon={barcodeOutline}
            slot="start" />Scan BarCode</IonButton>
        </div>
        <div className='div-input' hidden={!result} >
          <input className='input' type="text" readOnly value={result} />
          <div className='copy-icon'>
            <IonIcon icon={copyOutline} onClick={copyText}></IonIcon>
          </div>
        </div>
        <div hidden={!hideBg} className={box} />
      </IonContent>
    </IonPage>
  );


};

export default Home;
