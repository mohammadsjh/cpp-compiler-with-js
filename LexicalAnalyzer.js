function Buffer(input){
    var forward = 0;
    var lexemeBegining = 0;
    this.input = input;    
    this.nextChar = function() {return input[forward++];}
    this.takeLexeme = function() {
        let lexeme = input.substring(lexemeBegining, forward);
        lexemeBegining = forward;
        return lexeme;
    }
    this.deleteCurrentLexeme = function() {forward = lexemeBegining;}
    this.retract = function() {forward--;}
}
function LineTracker(){
    var line = 1;
    this.nextLine = function(){line++;}
    this.currentLine = function(){return line;}
}
function Token(name){
    this.name = name;
    this.value = 0;
    this.line = 0;
}

const initialInput = `if(x==2){
    int x=2;
} $`;
var newInput = initialInput.replace(/  +/g, ' ');
var buffer = new Buffer(newInput);
var tokenTable = new Array();
var state = 0;
var lineTracker = new LineTracker();

function isReserved(c){
    switch(c){
    case 'if':
        return 'if';
    case 'else':
        return 'else';
    case 'for':
        return 'for';
    case 'while':
        return 'while';
    case 'int':
        return 'int';
    case 'float':
        return 'float';
    case 'char':
        return 'char';
    case 'struct':
        return 'struct';
    case 'null':
        return 'null';
    case 'switch':
        return 'switch';
    case 'case':
        return 'case';
    case 'class':       
        return 'class';
    case 'signed':
        return 'signed';
    case 'unsigned':
        return 'unsigned';
    case 'enum':
        return 'enum';
    case 'struct':
        return 'struct';
    case 'void':
        return 'void';
    case 'define':
        return 'define';
    default:
        return 'id';
    }
}
function isCharacterALetter(c) {
    if(c===undefined)
        return false;
    return  /[a-zA-Z_]/.test(c);
}
function isCharacterADigit(c){
    return /[0-9]/.test(c);
}
function fail() {
    buffer.deleteCurrentLexeme();
    switch(state){
        case 0: state = 3; /*Identifier*/
            break;
        case 3: state = 4; /*Space*/
            break;
        case 4: state = 5; /*Line Break*/
            break;
        case 5:            /*Number*/
        case 7:
        case 8:
        case 9:
        case 10:
        case 11: state = 15; 
            break;
        case 15:           /*Relational Oprations*/
        case 22:
        case 24: state = 26;    /*Basic math Oprations*/
            break;
        case 26: state = 27;
            break;
        case 27: state = 28;
            break;
        case 28: state = 30;
            break;
        case 30: state = 31; 
            break;
        case 31: state = 32;    /*Symbols*/
            break;
        case 32: state = 33;
            break;
        case 33: state = 34;
            break;
        case 34: state = 35;
            break;
        case 35: state = 36;
            break;
        case 36: state = 37;
            break;
        case 37: state = 38;
            break;
        case 38: state = 39;
            break;
        case 39: state = 40;
            break;
        case 40: state = 41;
            break;
        case 41: state = 42;
            break;
        case 42: state = 43;
            break;
        case 43: state = 44;
            break;
        case 44: state = 46;    /*End of code*/
            break;
        case 46: state = 47;    /*Error*/
            break;
    }
}

function lexicalAnalyze(){
    var c='';
    while(1){
        switch(state){
            case 0: 
                c = buffer.nextChar();
                if(isCharacterALetter(c)){
                    state = 1;
                }else{
                fail();
                }
                break;
            case 1:
                c = buffer.nextChar();
                if(!(isCharacterALetter(c) || isCharacterADigit(c))){
                    state = 2;
                }
                break;
            case 2:
                buffer.retract();
                let lexeme = buffer.takeLexeme();
                let lexemeType = isReserved(lexeme);
                if(lexemeType==='id'){
                    var token = new Token('id');
                    token.value = lexeme;
                    token.line = lineTracker.currentLine();
                }else{
                    var token = new Token(lexemeType);
                    token.value = lexemeType;
                    token.line = lineTracker.currentLine();                
                }
                tokenTable.push(token);
                state = 0;
                break;
            case 3:
                c = buffer.nextChar();
                if (c ===' '){
                    buffer.takeLexeme();
                    state = 0;
                }
                else
                    fail();
                break;
            case 4:
                c = buffer.nextChar();
                if (c == '\n'){
                    buffer.takeLexeme();
                    lineTracker.nextLine();
                    state = 0;
                }
                else
                    fail();
                break;
            case 5:
                c = buffer.nextChar();
                if (isCharacterADigit(c))
                   state = 6;
                else
                    fail();
                break;
            case 6:
                c = buffer.nextChar();
                if(isCharacterADigit(c))
                    state = 6;
                else if(c == ".")
                    state = 7
                else if(c == "E")
                    state = 9;
                else if(!(isCharacterALetter(c) || isCharacterADigit(c)))
                    state = 13;
                else 
                    fail();
                break;
            case 7:
                c = buffer.nextChar();
                if(isCharacterADigit(c))
                    state = 8;
                else
                    fail();
                break;
            case 8:
                c = buffer.nextChar();
                if(isCharacterADigit(c))
                    state = 8;
                else if(!(isCharacterALetter(c) || isCharacterADigit(c)))
                    state = 14;
                else if(c == "E")
                    state = 9; 
                else
                    fail();
                break;
            case 9:
                c = buffer.nextChar();
                if(c == "+" || c == "-")
                    state = 10;
                else if(isCharacterADigit(c))
                    state = 11;
                else 
                    fail();
                break;
            case 10:
                c = buffer.nextChar();
                if(isCharacterADigit(c))
                    state = 11;
                else
                    fail();
                break;
            case 11:
                c = buffer.nextChar();
                if(isCharacterADigit(c))
                    state = 11;
                else if(!(isCharacterALetter(c) || isCharacterADigit(c)))
                    state = 12;
                else
                    fail();
                break;
            case 12:
                buffer.retract();
                var numberValue = buffer.takeLexeme();
                var token = new Token('number');
                token.value = numberValue;
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 13:
                buffer.retract();
                var numberValue = buffer.takeLexeme();
                var token = new Token('number');
                token.value = numberValue;
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 14:
                buffer.retract();
                var numberValue = buffer.takeLexeme();
                var token = new Token('number');
                token.value = numberValue;
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 15:
                c = buffer.nextChar();
                if(c == '<')
                    state = 16;
                else if(c == '>')
                    state = 19;
                else if(c == '=')
                    state = 22;                
                else if(c == '!')
                    state = 24;
                else
                    fail();
                break;
            case 16:
                c = buffer.nextChar();
                if(c == '=')
                    state = 17;
                else
                    state = 18;
                break;
            case 17:
                buffer.takeLexeme();
                var token = new Token("<=");
                token.value = "<=";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 18:
                buffer.retract();
                buffer.takeLexeme();
                var token = new Token("<");
                token.value = "<";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 19:
                c = buffer.nextChar();
                if(c == '=')
                    state = 20;
                else
                    state = 21;
                break;
            case 20:
                buffer.takeLexeme();
                var token = new Token(">=");
                token.value = ">=";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 21:
                buffer.retract();
                buffer.takeLexeme();
                var token = new Token(">");
                token.value = ">";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 22:
                c = buffer.nextChar();
                if(c == '=')
                    state = 23;
                else
                    fail();
                break;
            case 23:
                buffer.takeLexeme();
                var token = new Token("==");
                token.value = "==";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 24:
                c = buffer.nextChar();
                if(c == '=')
                    state = 25;
                else
                    fail();
                break;
            case 25:
                buffer.takeLexeme();
                var token = new Token("!=");
                token.value = "!=";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                break;
            case 26:
                c = buffer.nextChar();
                if(c == '+'){
                    buffer.takeLexeme();
                    var token = new Token("+");
                    token.value = "+";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else
                    fail();
                break;
            case 27:
                c = buffer.nextChar();
                if(c == '-'){
                    buffer.takeLexeme();
                    var token = new Token("-");
                    token.value = "-";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else
                    fail();
                break;
            case 28:
                c = buffer.nextChar();
                if(c == '*')
                    state = 29;
                else
                    fail();
                break;
            case 29:
                c = buffer.nextChar();
                if(c == '*'){
                    buffer.takeLexeme();
                    var token = new Token("**");
                    token.value = "**";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else{
                    buffer.retract();
                    buffer.takeLexeme();
                    var token = new Token("*");
                    token.value = "*";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }
                break;
            case 30:
                c = buffer.nextChar();
                if(c == '/'){
                    buffer.takeLexeme();
                    var token = new Token("/");
                    token.value = "/";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 31:
                c = buffer.nextChar();
                if(c == '='){
                    buffer.takeLexeme();
                    var token = new Token("=");
                    token.value = "=";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 32:
                c = buffer.nextChar();
                if(c == '!'){
                    buffer.takeLexeme();
                    var token = new Token("!");
                    token.value = "!";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 33:
                c = buffer.nextChar();
                if(c == '('){
                    buffer.takeLexeme();
                    var token = new Token("(");
                    token.value = "(";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 34:
                c = buffer.nextChar();
                if(c == ')'){
                    buffer.takeLexeme();
                    var token = new Token(")");
                    token.value = ")";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 35:
                c = buffer.nextChar();
                if(c == '{'){
                    buffer.takeLexeme();
                    var token = new Token("{");
                    token.value = "{";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 36:
                c = buffer.nextChar();
                if(c == '}'){
                    buffer.takeLexeme();
                    var token = new Token("}");
                    token.value = "}";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 37:
                c = buffer.nextChar();
                if(c == '&'){
                    c = buffer.nextChar();
                    if(c == '&'){
                    buffer.takeLexeme();
                    var token = new Token("&&");
                    token.value = "&&";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                    }else fail();
                }else if(c == '|'){
                    c = buffer.nextChar();
                    if(c == '|'){
                    buffer.takeLexeme();
                    var token = new Token("||");
                    token.value = "||";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                    }else fail();
                }else
                    fail();
                break;
            case 38:
                c = buffer.nextChar();
                if(c == '['){
                    buffer.takeLexeme();
                    var token = new Token("[");
                    token.value = "[";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 39:
                c = buffer.nextChar();
                if(c == ']'){
                    buffer.takeLexeme();
                    var token = new Token("]");
                    token.value = "]";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 40:
                c = buffer.nextChar();
                if(c == ';'){
                    buffer.takeLexeme();
                    var token = new Token(";");
                    token.value = ";";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 41:
                c = buffer.nextChar();
                if(c == ':'){
                    buffer.takeLexeme();
                    var token = new Token(":");
                    token.value = ":";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 42:
                c = buffer.nextChar();
                if(c == '\"'){
                    buffer.takeLexeme();
                    var token = new Token("\"");
                    token.value = "\"";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 43:
                c = buffer.nextChar();
                if(c == '\''){
                    buffer.takeLexeme();
                    var token = new Token("\'");
                    token.value = "\'";
                    token.line = lineTracker.currentLine();
                    tokenTable.push(token);
                    state = 0;
                }else 
                    fail();
                break;
            case 44:
                c = buffer.nextChar();
                if(c == '\\')
                    state = 45;
                else
                    fail();
                break;
            case 45:
                c = buffer.nextChar();
                if('\\'){
                buffer.takeLexeme();
                var token = new Token("\\\\");
                token.value = "\\\\";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                }else{
                buffer.retract();
                buffer.takeLexeme();
                var token = new Token("\\");
                token.value = "\\";
                token.line = lineTracker.currentLine();
                tokenTable.push(token);
                state = 0;
                }
            case 46:
                if(c === '$')
                    return;
                else
                    fail();
                break;
            case 47:
                currentChar = buffer.nextChar();
                buffer.takeLexeme();
                state = 0;
                let errorStatement = "\'" + currentChar +"\'" +" on line: "+ lineTracker.currentLine() + " matches no pattern";
                console.log(errorStatement);
                break;         
        }
    }
}
lexicalAnalyze();

tokenTable.forEach(i => {
    console.log(i.name + " | " + i.value + " | " + i.line);
});
