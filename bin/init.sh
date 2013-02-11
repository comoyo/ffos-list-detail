CMD="$(readlink $0)"
CMD_DIR=`dirname "$CMD"`
cd "$CMD_DIR/.."

npm install bower -g
git submodule update --init --recursive
npm install
cd www/
bower install