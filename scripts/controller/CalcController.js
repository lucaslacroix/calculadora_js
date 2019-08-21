class CalcController {
    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._operation = [];
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard()
    }

    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', evt => {
                this.toggleAudio();
            });
        });
    }
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }
    playAudio(){
        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }
    initKeyboard(){
        document.addEventListener('keyup', evt => {
            this.playAudio();


            switch (evt.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(evt.key);
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                    break;
            }
        });
    }
    addEventListenerAll(elem, evts, fn) {
        evts.split(' ').forEach(evt => {
            elem.addEventListener(evt, fn);
        })
    }
    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g')

        buttons.forEach((button, index) => {
            this.addEventListenerAll(button, 'click drag', e => {
                console.log(button.className.baseVal.replace('btn-', ''));
                this.execBtn(button.className.baseVal.replace('btn-', ''));
            });
        })
    }
    execBtn(btn) {

        this.playAudio();

        switch (btn) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addOperation('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(btn))
                break;

            default:
                this.setError();
                break;
        }
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }
    clearEntry() {
        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperation(op) {
        this._operation.push(op);

        if (this._operation.length > 3) {
            this.calc();
            console.log(this._operation);
        }
    }

    calc() {
        let last = '';

        this._lastOperator = this.getLastItem();

        if( this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        if(this._operation.length > 3) {
            last = this._operation.pop();

            this._lastNumber = this.getResult();
        } else if(this._operation.length === 3) {
            
            this._lastNumber = this.getResult(false);

        }

        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];
        } else {

            this._operation = [result];

            if(last){
                this._operation.push(last)
            }
        }

        this.setLastNumberToDisplay();
    }

    addOperation(op) {

        console.log('Operador: ' + op);
        if (isNaN(this.getLastOperation())) {
            // String
            // console.log('É um operador? ' + this.isOperator(op));
            if (this.isOperator(op)) {

                this.setLastOperation(op);

            } else if (isNaN(op)) {
                // console.log(op);
            } else {
                this.pushOperation(op);
            }

        } else {
            // Number
            if (this.isOperator(op)) {
                this.pushOperation(op);
            } else {
                let newValue = this.getLastOperation().toString() + op.toString();
                this.setLastOperation(newValue);

            }
        }

        this.setLastNumberToDisplay();
        // console.log(this._operation);

    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1){
            return;
        }

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    getResult(){
        return eval(this._operation.join(''));
    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = (this._operation.length - 1); i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem){
            lastItem = isOperator ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        this.displayCalc = !lastNumber ? 0 : lastNumber;
    }

    setError() {
        this.displayCalc = "Error";
    }


    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(date) {
        this._dateEl.innerHTML = date;
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }
    set displayTime(time) {
        this._timeEl.innerHTML = time;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(displayCalc) {
        if(displayCalc.length > 10){
            this.setError;

            return false;
        }

        this._displayCalcEl.innerHTML = displayCalc;
    }

    get currentDate() {
        return new Date();
    }
    set currentDate(currentDate) {
        this._currentDate = currentDate;
    }
}